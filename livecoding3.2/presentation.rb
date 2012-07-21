require 'sinatra'

class Presentation < Sinatra::Application

  configure do
    set(:public_folder) { "#{root}/static" }
  end


  get '/' do
    send_file "presentation.html"
  end

  post "/compile" do
    begin
      options = Compass.configuration.to_sass_engine_options
      options.update(:syntax => :scss, :style => :expanded, :line_comments => false)
      engine = Sass::Engine.new(params[:sass], options)
      engine.render
    rescue Sass::SyntaxError => e
      halt 400, e.message
    end
  end

end

