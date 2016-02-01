# deploy.sh
# Setup a deploy directory for the build
#

echo ":: going to setup a speckly directory and re-fill it."
read

CWD=`pwd`
DEPLOY_DIR=$PWD/speckly

if [ -d "$DEPLOY_DIR" ] ; then
    rm -rf $DEPLOY_DIR
fi

RESOURCES_DIR=$PWD/resources/public


mkdir $DEPLOY_DIR

echo ":: copying resources ..."

cp "$RESOURCES_DIR/index-speckly.html" "$DEPLOY_DIR/index.html"
cp -r "$RESOURCES_DIR/img" "$DEPLOY_DIR"

echo ":: done."

