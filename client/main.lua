local ESX = nil
local panelVisible = false

Citizen.CreateThread(function()
    while ESX == nil do
        ESX = exports["es_extended"]:getSharedObject()
        Citizen.Wait(0)
    end
end)

local function toggleNuiFrame(shouldShow)
    if panelVisible == shouldShow then
        return  -- Não faz nada se o painel já estiver no estado desejado
    end

    SetNuiFocus(shouldShow, shouldShow)
    local action = shouldShow and "open" or "close"
    SendNUIMessage({ action = action, visible = shouldShow })

    panelVisible = shouldShow  -- Atualiza o estado do painel
end

local function isJobAllowed(jobName)
    for _, allowedJob in ipairs(Config.JobAllow) do
        if jobName == allowedJob then
            return true
        end
    end
    return false
end

RegisterCommand('mdt', function()
    local playerData = ESX.GetPlayerData()
    if Config.JobAllow and isJobAllowed(playerData.job.name) then
        toggleNuiFrame(true)  -- Abre o painel
    else
        ESX.ShowNotification("Aviso", "Você não tem permissão para abrir este painel!", 5000, 'warning')
    end
end)

RegisterNUICallback('close', function(_, cb)
    toggleNuiFrame(false)  -- Fecha o painel
end)

RegisterNUICallback('getInfoAgent', function(_, cb)
    TriggerServerEvent('mdtpolice:requestPlayerData')
    -- Registre o evento uma vez
    RegisterNetEvent('mdtpolice:responsePlayerData')
    AddEventHandler('mdtpolice:responsePlayerData', function(playerData)
        local refData = { 
            nome = playerData.fullName or "Desconhecido", 
            jobString = playerData.formattedJobInfo or "Desconhecido", 
            job = playerData.job or "Desconhecido" 
        }
        cb(refData)
    end)
end)

function requestAgents(jobName)
    TriggerServerEvent('mdtpolice:requestAgents', jobName)
end

RegisterNUICallback('getAllAgents', function(_, cb)
    local playerData = ESX.GetPlayerData()
    if Config.JobAllow and isJobAllowed(playerData.job.name) then
        requestAgents(playerData.job.name)
    end
end)

RegisterNetEvent('mdtpolice:responseAgents')
AddEventHandler('mdtpolice:responseAgents', function(agents)
    SendNUIMessage({ action = 'updateAgents', data = agents })
end)

function requestAllPlayersData()
    TriggerServerEvent('mdtpolice:requestAllPlayersData')
end

RegisterNUICallback('getAllPlayersData', function(_, cb)
    local playerData = ESX.GetPlayerData()
    if Config.JobAllow and isJobAllowed(playerData.job.name) then
        requestAllPlayersData()
    end
end)

RegisterNetEvent('mdtpolice:responseAllPlayersData')
AddEventHandler('mdtpolice:responseAllPlayersData', function(players)
    SendNUIMessage({ action = 'updateAllPlayersData', data = players })
end)

RegisterNUICallback('hire', function(data, cb)
    local dbPlayerId = data.playerId -- ID do jogador na base de dados
    print("ID do jogador na base de dados: " .. dbPlayerId)

    -- Envia o ID do jogador para o servidor
    TriggerServerEvent('findPlayerByDbId', dbPlayerId)
end)

RegisterNetEvent('findPlayerResponse')
AddEventHandler('findPlayerResponse', function(success, foundPlayerSource)
    responseReceived = true -- Define que a resposta foi recebida
    if success then
        foundPlayerSource = foundPlayerSource
        ESX.ShowNotification("Aviso", foundPlayerSource, 5000, 'warning')
    end
end)
