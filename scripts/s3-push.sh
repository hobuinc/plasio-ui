#!/usr/bin/env bash
#

S3_CREDS=$HOME/.s3env-iowa-lidar

if [ ! -f "$S3_CREDS" ] ; then
    echo " :: S3 Credentials for iowa lidar upload are missing, will not do S3 sync."
    exit 0
else
    source $HOME/.s3env-iowa-lidar
fi

TARGETDIR=`pwd`/deploy

echo " :: Syncing with S3, source: $TARGETDIR"
cd $TARGETDIR && s3cmd --access_key=$ACCESS_KEY --secret_key=$SECRET_KEY --delete-removed -P sync . s3://iowalidar.com/