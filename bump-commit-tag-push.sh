version=$(node ./bump-version.js)
echo
echo "Version bumped to: $version"
echo
 echo $(git add .)
echo $(git commit -m "$1")
echo $(git tag $version)
echo $(git push origin main)
echo $(git push origin main $version)
if [ $2 == "dev" ]
then
 echo $(APP_ENV=dev ./deploy.sh)
fi
if [ $2 == "prd" ]
then
 echo $(APP_ENV=prd ./deploy.sh)
fi
