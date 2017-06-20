# -*- coding: utf-8 -*-

from __future__ import print_function

import os

from fabric.api import (
    env,
    local,
    cd,
    put,
    abort,
    hosts,
    task,
)
from fabric.contrib.files import exists
from fabric.colors import (
    green,
    red,
)

APP_NAME = 'teemo'
TEST_HOSTS = ['106.14.67.99']
PRD_HOSTS = ['139.224.199.195']
REMOTE_USER = 'fly'
REMOTE_DIR = '/home/{}/{}'.format(REMOTE_USER, APP_NAME)
LOCAL_DIR = os.path.dirname(os.path.realpath(__file__))
VENV_DIR = '{}/venv'.format(REMOTE_DIR)
DIST_DIR = '{}/{}'.format(LOCAL_DIR, 'dist')

env.use_ssh_config = True
env.keepalive = 60
env.user = REMOTE_USER

def do_deploy():
    print('Start deployment of {}.'.format(APP_NAME))
    print('Copy static files to remote dir of {}.'.format(REMOTE_DIR))
    with cd(LOCAL_DIR):
        put('{}/*'.format(DIST_DIR), REMOTE_DIR)
    print(green('Copy complete!'))

@task
@hosts(TEST_HOSTS)
def t_deploy():
    do_deploy()

@task
@hosts(PRD_HOSTS)
def p_deploy():
    do_deploy()
