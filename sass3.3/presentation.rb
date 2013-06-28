require 'sinatra'
require 'timeout'

class Presentation < Sinatra::Application

  configure do
    set(:root) {File.dirname(__FILE__)}
    set(:public_folder) { "#{root}/static" }
    Compass.add_project_configuration("#{File.dirname(__FILE__)}/config.rb")
  end


  get '/' do
    send_file File.dirname(__FILE__)+"/presentation.html"
  end

  post "/compile" do
    begin
      before = Time.now
      options = Compass.configuration.to_sass_engine_options
      name = params[:name]
      write_sourcemap = params[:sourcemap]
      output_sourcemap = false
      style = params[:style]
      style ||= :expanded
      style = style.to_sym
      if style == :sourcemap
        output_sourcemap = true
        style = :expanded
      end
      outputdir = File.dirname(__FILE__) + "/static/output"
      sass_file = "#{outputdir}/#{name}.scss"
      css_file  = "#{outputdir}/#{name}.css"
      map_file  = "#{outputdir}/#{name}-map.json"
      options = options.merge(:syntax => :scss,
                              :style => style,
                              :line_comments => false,
                              :filename => sass_file,
                              :css_path => css_file,
                              :sourcemap_path => map_file)
      engine = Sass::Engine.new(params[:sass], options)
      Timeout.timeout(8) do
        css, map = if write_sourcemap || output_sourcemap
                     engine.render_with_sourcemap("#{name}-map.json")
                   else
                     [engine.render, nil]
                   end
        map_json = map.to_json(options) if map
        if write_sourcemap
          FileUtils.mkdir_p(outputdir)
          File.open(sass_file, "wb"){|f| f.write(params[:sass]) }
          File.open(css_file, "wb"){|f| f.write(css) }
          File.open(map_file, "wb"){|f| f.write(map_json) }
        end
        if output_sourcemap
          map_json
        else
          css
        end
      end
    rescue Sass::SyntaxError => e
      halt 400, e.message
    ensure
      after ||= Time.now
      puts "Compilation took #{after - before}"
    end
  end

end

