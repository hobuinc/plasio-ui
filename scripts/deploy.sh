# deploy.sh
# Setup a deploy directory for the build
#

echo ":: going to setup a deploy directory and re-fill it."
read

CWD=`pwd`
DEPLOY_DIR=$PWD/deploy

if [ -d "$DEPLOY_DIR" ] ; then
    rm -rf $DEPLOY_DIR
fi


mkdir $DEPLOY_DIR

echo ":: cleaning current build..."
lein clean

echo ":: performing a release build..."
lein cljsbuild once min

echo ":: staging resources..."
cp -r "$CWD/resources/public/" $DEPLOY_DIR

echo ":: done."
