#!/bin/sh

# Instalacion antigua manual
# sudo apt-get install ruby-full build-essential zlib1g-dev

# mkdir ~/.gem
# mkdir ~/.gem/ruby
# mkdir ~/.gem/ruby/2.5.0

# ln -s ~/.gem/ruby/2.5.0 ~/.gem/ruby/ruby
# echo '# Install Ruby Gems to ~/gems' >> ~/.bashrc
# echo 'export GEM_HOME="$HOME/.gem/ruby/ruby"' >> ~/.bashrc
# echo 'export PATH="$GEM_HOME/bin:$PATH"' >> ~/.bashrc

# source ~/.bashrc

# INSTALACION NUEVA CON EL RVM
sudo apt-get install software-properties-common

sudo apt-add-repository -y ppa:rael-gc/rvm
sudo apt-get update
sudo apt-get install rvm

sudo usermod -a -G rvm $USER
rvm user gemsets
rvm install ruby

# reboot
su - $USER

rvm user gemsets
rvm reset

rvm install 2.5.8
rvm --default use 2.5.8

# Instalar Gemas del proyecto
gem install jekyll bundler
gem update --system 3.2.3

cd docs
bundle install

curl -sL https://raw.githubusercontent.com/nvm-sh/nvm/v0.35.0/install.sh -o install_nvm.sh
chmod +x install_nvm.sh
./install_nvm.sh

source ~/.bashrc
nvm install --lts