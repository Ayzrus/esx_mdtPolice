ESX = exports["es_extended"]:getSharedObject()

local playerIdMapping = {}

AddEventHandler('playerConnecting', function(playerName, setKickReason, deferrals)
    local src = source
    local identifier = GetPlayerIdentifiers(src)[1]
    
    if identifier then
        local playerData = MySQL.Sync.fetchAll('SELECT id FROM users WHERE identifier = @identifier', {
            ['@identifier'] = identifier
        })

        if #playerData > 0 then
            local dbId = playerData[1].id
            playerIdMapping[dbId] = src
        end
    end
end)

AddEventHandler('playerDropped', function()
    local src = source
    for dbId, serverId in pairs(playerIdMapping) do
        if serverId == src then
            playerIdMapping[dbId] = nil
            break
        end
    end
end)

function getAllAgentsForJob(jobName, callback)
    local query = [[
        SELECT DISTINCT
            U.id,
            U.firstName AS FirstName,
            U.lastName AS LastName,
            J.label AS Job,
            JB.label AS JobRole
        FROM users U
        LEFT JOIN jobs J ON U.job = J.name
        LEFT JOIN job_grades JB ON JB.grade = U.job_grade
        WHERE U.job = @jobName
    ]]

    MySQL.Async.fetchAll(query, {['@jobName'] = jobName}, function(results)
        local agents = {}

        for _, result in ipairs(results) do
            local dbId = result.id
            local isOnline = playerIdMapping[dbId] ~= nil

            table.insert(agents, {
                Id = dbId,
                Nome = (result.FirstName or "Desconhecido") .. " " .. (result.LastName or "Desconhecido"),
                Cargo = result.JobRole or "Desconhecido",
                Status = isOnline,
            })
        end

        if callback then
            callback(agents)
        end
    end)
end

function getAllPlayers(callback)
    MySQL.Async.fetchAll([[
        SELECT DISTINCT
            U.id,
            U.firstName AS FirstName,
            U.lastName AS LastName,
            U.job AS Job
        FROM users U
    ]], {}, function(results)
        local players = {}

        for _, result in ipairs(results) do
            local dbId = result.id

            table.insert(players, {
                Id = dbId,
                Nome = (result.FirstName or "Desconhecido") .. " " .. (result.LastName or "Desconhecido"),
                Cargo = result.Job or "Desconhecido",
            })
        end

        if callback then
            callback(players)
        end
    end)
end

RegisterServerEvent('mdtpolice:requestPlayerData')
AddEventHandler('mdtpolice:requestPlayerData', function()
    local _source = source
    local xPlayer = ESX.GetPlayerFromId(_source)
    
    if xPlayer then
        local identifier = xPlayer.identifier

        MySQL.Async.fetchAll('SELECT firstName, lastName FROM users WHERE identifier = @identifier', {
            ['@identifier'] = identifier
        }, function(result)
            if #result > 0 then
                local firstName = result[1].firstName
                local lastName = result[1].lastName
                local fullName = firstName .. " " .. lastName
                
                local playerData = {
                    fullName = fullName,
                    formattedJobInfo = xPlayer.job.label .. " | " .. xPlayer.job.grade_label,
                    job = xPlayer.job.label
                }
                
                TriggerClientEvent('mdtpolice:responsePlayerData', _source, playerData)
            else
                TriggerClientEvent('mdtpolice:responsePlayerData', _source, {
                    fullName = "Desconhecido",
                    formattedJobInfo = xPlayer.job.label .. " | " .. xPlayer.job.grade_label,
                    job = xPlayer.job.label
                })
            end
        end)
    end
end)

RegisterServerEvent('mdtpolice:requestAgents')
AddEventHandler('mdtpolice:requestAgents', function(jobName)
    getAllAgentsForJob(jobName, function(agents)
        TriggerClientEvent('mdtpolice:responseAgents', -1, agents)
    end)
end)

RegisterServerEvent('mdtpolice:requestAllPlayersData')
AddEventHandler('mdtpolice:requestAllPlayersData', function()
    getAllPlayers(function(players)
        TriggerClientEvent('mdtpolice:responseAllPlayersData', -1, players)
    end)
end)
