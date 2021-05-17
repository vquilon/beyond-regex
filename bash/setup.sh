sudo apt-get install ruby-full build-essential zlib1g-dev

mkdir ~/.gem
mkdir ~/.gem/ruby
mkdir ~/.gem/ruby/2.5.0

ln -s ~/.gem/ruby/2.5.0 ~/.gem/ruby/ruby
echo '# Install Ruby Gems to ~/gems' >> ~/.bashrc
echo 'export GEM_HOME="$HOME/.gem/ruby/ruby"' >> ~/.bashrc
echo 'export PATH="$GEM_HOME/bin:$PATH"' >> ~/.bashrc

source ~/.bashrc

gem install jekyll bundler