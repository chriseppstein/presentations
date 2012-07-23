require 'sinatra'
require 'timeout'

class Presentation < Sinatra::Application

  configure do
    set(:root) {File.dirname(__FILE__)}
    set(:public_folder) { "#{root}/static" }
  end


  get '/' do
    send_file File.dirname(__FILE__)+"/presentation.html"
  end

  post "/compile" do
    begin
      before = Time.now
      options = Compass.configuration.to_sass_engine_options
      options.update(:syntax => :scss, :style => (params[:style] || :expanded).to_sym, :line_comments => false)
      engine = Sass::Engine.new(params[:sass], options)
      Timeout.timeout(1.5) do
        engine.render
      end
    rescue Sass::SyntaxError => e
      halt 400, e.message
    ensure
      after ||= Time.now
      puts "Compilation took #{after - before}"
    end
  end

end

