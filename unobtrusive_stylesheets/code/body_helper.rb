module BodyHelper
  # Returns a hash of attributes for the body tag. This can be passed to haml like so:
  # %body{body_attributes}
  def body_attributes(additional_attributes = {})
    set_body_class(additional_attributes.delete(:class))
    { :class => body_class, :id => body_id }.merge(additional_attributes)
  end

  # Gets the css class for the body of this page defaulting it if none has been set.
  def body_class
    @body_class.blank? ? @controller.controller_name : @body_class
  end

  # Gets the ID for the body of this page defaulting it if none has been set.
  def body_id
    @body_id || "#{@controller.controller_name}_#{@controller.action_name}"
  end

  # Sets the body class. Appends to any classes already set.
  def set_body_class(*names)
    @body_class = add_css_class(@body_class, *names)
  end
  
  # Sets the body id
  def set_body_id(id)
    @body_id = id
  end

  #adds one or more css classes to a string of css classes, guards against nil, duplicate classes, etc.
  #Ex:
  # add_css_class(nil,"myclass") # => "myclass"
  # add_css_class("existing","new") # => "existing new"
  # add_css_class("another existing","existing","new") #=> "another existing new"
  def add_css_class(*classes)
    classes.flatten.compact.map{|c| c.to_s.strip.split(/\s+/)}.flatten.uniq.sort.join(" ")
  end
end