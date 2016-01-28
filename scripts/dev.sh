#!/bin/sh
# development script

SESSION_NAME=plasio-ui
PWD=`pwd`

# move vendor stuff to dist
tmux has-session -t $SESSION_NAME
if [ $? != 0 ] ; then
    tmux new-session -d -s $SESSION_NAME -c $PWD 'lein figwheel'
    tmux split-window -v -t $SESSION_NAME -c $PWD 'scripts/sass.sh'
    tmux select-layout -t $SESSION_NAME even-vertical
fi

tmux attach -t $SESSION_NAME
