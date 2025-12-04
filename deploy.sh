#!/bin/bash
################################
#                              #
#   expected .env files:       #
#     .env                     #
#     .env.dev                 #
#     .env.prd                 #
#     $HOME/bead-env/bead.env  #
#       MY_ARN                 #
#       DEV_S3                 #
#       DEV_CLOUDFRONT         #
#       PRD_S3                 #
#       PRD_CLOUDFRONT         #
#                              #
#   options:                   #
#     -i invalidate only       #
#                              #
################################

echo "!!!!!!!"
echo $APP_ENV
exit
source $HOME/bead-env/bead.env
source $HOME/bead-env/aws_sesssion_creds.env

while read var
do
  if [ "$var" != "" ]
  then
    eval "export $var"
  fi
done < .env

echo ""
echo "Environment variables sourced:"
echo ""
echo MY_ARN=$MY_ARN
echo DEV_S3=$DEV_S3
echo DEV_CLOUDFRONT=$DEV_CLOUDFRONT
echo PRD_S3=$PRD_S3
echo PRD_CLOUDFRONT=$PRD_CLOUDFRONT
echo ""
echo AWS_ACCESS_KEY_ID=$AWS_ACCESS_KEY_ID
echo AWS_SECRET_ACCESS_KEY=$AWS_SECRET_ACCESS_KEY
echo AWS_SESSION_TOKEN=$AWS_SESSION_TOKEN
echo AWS_SESSION_TOKEN_EXPIRES=$AWS_SESSION_TOKEN_EXPIRES
echo ""

invalidate_only=$1

# if APP_ENV is not set have user enter it
if [[ "$APP_ENV" != "dev" && "$APP_ENV" != "prd" ]]
then
  echo "Deploy [dev|prd]:"
  read deploy
else
  deploy=$APP_ENV
fi

while read var
do
  if [ "$var" != "" ]
  then
    eval "export $var"
  fi
done < .env.$deploy

echo "Vite environment:"
echo ""

env | grep VITE |
while read var
do
  echo $var
done

echo ""

# if AWS_SESSION_TOKEN has expired generate a new one
now=$(date +%FT%T%z)
if [ "$AWS_SESSION_TOKEN_EXPIRES" != "" ]
then
  expires=$(date -jf %FT%T+%H:%M $AWS_SESSION_TOKEN_EXPIRES +%FT%T%z)
else
  expires="1999"
fi

if [[ "$now" > "$expires" ]]
then

  echo ""
  echo "Enter 6 digit auth code:"
  read code

  unset AWS_ACCESS_KEY_ID
  unset AWS_SECRET_ACCESS_KEY
  unset AWS_SESSION_TOKEN

  mfa_session=$(aws sts get-session-token --serial-number $MY_ARN --token-code $code)

  export AWS_ACCESS_KEY_ID=$(echo $mfa_session | jq -r .Credentials.AccessKeyId)
  export AWS_SECRET_ACCESS_KEY=$(echo $mfa_session | jq -r .Credentials.SecretAccessKey)
  export AWS_SESSION_TOKEN=$(echo $mfa_session | jq -r .Credentials.SessionToken)
  export AWS_SESSION_TOKEN_EXPIRES=$(echo $mfa_session | jq -r .Credentials.Expiration)
  
  echo "export AWS_ACCESS_KEY_ID=$AWS_ACCESS_KEY_ID" > $HOME/bead-env/aws_sesssion_creds.env
  echo "export AWS_SECRET_ACCESS_KEY=$AWS_SECRET_ACCESS_KEY" >> $HOME/bead-env/aws_sesssion_creds.env
  echo "export AWS_SESSION_TOKEN=$AWS_SESSION_TOKEN" >> $HOME/bead-env/aws_sesssion_creds.env
  echo "export AWS_SESSION_TOKEN_EXPIRES=$AWS_SESSION_TOKEN_EXPIRES" >> $HOME/bead-env/aws_sesssion_creds.env

  echo ""
  echo "Environment variables have been set:"
  echo ""
  echo AWS_ACCESS_KEY_ID=$AWS_ACCESS_KEY_ID
  echo AWS_SECRET_ACCESS_KEY=$AWS_SECRET_ACCESS_KEY
  echo AWS_SESSION_TOKEN=$AWS_SESSION_TOKEN
  echo AWS_SESSION_TOKEN_EXPIRES=$AWS_SESSION_TOKEN_EXPIRES
  echo ""

else

  echo ""
  echo "Reusing current session token..."
  echo ""

fi

# deploy and invalidate or just invalidate
if [ $deploy == "dev" ]
then
  if [ "$invalidate_only" != "-i" ]
  then
    npm run build:debug
    aws s3 rm --recursive s3://$DEV_S3/$VITE_APP_PATH/
    aws s3 cp --recursive ./dist/ s3://$DEV_S3/$VITE_APP_PATH/
  fi
  aws cloudfront create-invalidation --distribution-id $DEV_CLOUDFRONT --paths "/$VITE_APP_PATH*"
elif [ $deploy == "prd" ]
then
  if [ "$invalidate_only" != "-i" ]
  then
    npm run build
    aws s3 rm --recursive s3://$PRD_S3/$VITE_APP_PATH/
    aws s3 cp --recursive ./dist/ s3://$PRD_S3/$VITE_APP_PATH/
  fi
  aws cloudfront create-invalidation --distribution-id $PRD_CLOUDFRONT --paths "/minnesota/selection*"
else
  echo "Invalid deployment target"
fi
