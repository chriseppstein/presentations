require "bundler/setup"
require "sinatra"
require "compass"

require File.dirname(__FILE__)+'/livecoding3.2/presentation.rb'
run Presentation.new
