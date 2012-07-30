require "bundler/setup"
require "sinatra"
require "compass"

require File.dirname(__FILE__)+'/presentation.rb'
run Presentation.new
