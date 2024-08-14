Config = {}

Config.Notification = function(title, message, duration, type)
    exports['okokNotify']:Alert(title, message, duration, type)
end

Config.JobAllow = {"psp", "gnr"}