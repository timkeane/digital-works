#!/bin/bash
#################################
#                               #
#  Manage .env files to run     #
#  and build the bead app for   #
#  various states by copying    #
#  files from $HOME/bead-env/   #
#  to the project directory.    #
#                               #
#  Create a state diectory in   #
#  $HOME/bead-env/ and place    #
#  the following files in it:   #
#                               #
#    .env                       #
#    .env.dev                   #
#    .env.prd                   #
#                               #
#  To use a different path to   #
#  to the .env files specify    #
#  the path as an argument to   #
#  this script.                 #
#                               #
#  See README.md for required   #
#  variables                    #
#                               #
#################################

path=$1
if [ "$path" == "" ]
then
  echo "Enter a state:"
  read state
  path=$HOME/bead-env/$state/
fi

cp -r $path/. .

echo ""
echo ".env files copied to $(pwd):"
echo ""

ls -la .env*
