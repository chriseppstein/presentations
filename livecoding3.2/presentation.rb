require 'sinatra'

class Presentation < Sinatra::Application

  configure do
    set(:public_folder) { "#{root}/static" }
  end


  get '/' do
    send_file "presentation.html"
  end

end

