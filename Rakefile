task :default => [:safari, :standalone]

desc 'Build standalone file'
task :standalone => ['chrome/flying-focus.js', 'chrome/flying-focus.css'] do
  require 'jspp'
  File.open('standalone/flying-focus.js', 'w') { |file|
    text = JSPP('standalone/flying-focus.jspp.js')
    file.write(text)
  }
  puts 'standalone/flying-focus.js'
end


desc 'Build Safari extension to ./FlyingFocus.safariextension/'
task :safari => ['chrome/flying-focus.js', 'chrome/flying-focus.css'] do
  cp_r ['chrome/flying-focus.js', 'chrome/flying-focus.css'], 'FlyingFocus.safariextension'
  puts 'FlyingFocus.safariextension'
end

#FIXME
#task :firefox do
#
#end

#FIXME
#task :ie do
#
#end
