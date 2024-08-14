fx_version 'cerulean'

description 'MDT Police Panel'
author 'RodrigoDev'
version '1.0.0'

lua54 'yes'

games {
  "gta5",
  "rdr3"
}

ui_page 'web/build/index.html'

shared_script 'shared/config.lua'

client_script 'client/**/*.lua'

server_script {
  'server/**/*.lua',
  '@mysql-async/lib/MySQL.lua',
}

files {
  'web/build/index.html',
  'web/build/**/*'
}
