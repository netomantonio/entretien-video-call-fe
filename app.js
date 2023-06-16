$(document).ready(async () => {
    const webComponent = document.querySelector('openvidu-webcomponent');
    const APPLICATION_FRONTEND_URL = window.localStorage.getItem("APPLICATION_FRONTEND_URL")

    webComponent.addEventListener('onSessionCreated', (event) => {
        const session = event.detail;

        // You can see the session documentation here
        // https://docs.openvidu.io/en/stable/api/openvidu-browser/classes/session.html

        session.on('connectionCreated', (e) => {
            console.log("connectionCreated", e);
        });

        session.on('streamDestroyed', (e) => {
            console.log("streamDestroyed", e);
        });

        session.on('streamCreated', (e) => {
            console.log("streamCreated", e);
        });

        session.on('sessionDisconnected', (event) => {
            console.warn("sessionDisconnected", event);
            window.location.replace(APPLICATION_FRONTEND_URL + "/interviews")
            window.close()
        });

        session.on('exception', (exception) => {
            console.error(exception);
        });
    });

    webComponent.addEventListener('onJoinButtonClicked', (event) => { });
    webComponent.addEventListener('onToolbarLeaveButtonClicked', (event) => { });
    webComponent.addEventListener('onToolbarCameraButtonClicked', (event) => { });
    webComponent.addEventListener('onToolbarMicrophoneButtonClicked', (event) => { });
    webComponent.addEventListener('onToolbarScreenshareButtonClicked', (event) => { });
    webComponent.addEventListener('onToolbarParticipantsPanelButtonClicked', (event) => { });
    webComponent.addEventListener('onToolbarChatPanelButtonClicked', (event) => { });
    webComponent.addEventListener('onToolbarFullscreenButtonClicked', (event) => { });
    webComponent.addEventListener('onParticipantCreated', (event) => { });

});

async function joinSession(sessionId, tokenServerApp, interviewId, APPLICATION_SERVER_URL) {

    // Requesting tokens
    const promiseResults = await Promise.all(
        [
            getToken(sessionId, tokenServerApp, interviewId, APPLICATION_SERVER_URL),
            getToken(sessionId, tokenServerApp, interviewId, APPLICATION_SERVER_URL)
        ]
    );
    const tokens = {webcam: promiseResults[0], screen: promiseResults[1]};

    //Getting the webcomponent element
    const webComponent = document.querySelector('openvidu-webcomponent');


    // Displaying webcomponent
    webComponent.style.display = 'block';

    // webComponent.participantName = participantName;

    // You can see the UI parameters documentation here
    // https://docs.openvidu.io/en/stable/api/openvidu-angular/components/OpenviduWebComponentComponent.html#inputs

    // webComponent.toolbarScreenshareButton = false;
    // webComponent.minimal = true;
    // webComponent.prejoin = true;

    // webComponent.videoMuted = false;
    // webComponent.audioMuted = false;

    // webComponent.toolbarScreenshareButton = true;
    // webComponent.toolbarFullscreenButton = true;
    // webComponent.toolbarLeaveButton = true;
    // webComponent.toolbarChatPanelButton = true;
    // webComponent.toolbarParticipantsPanelButton = true;
    webComponent.toolbarDisplayLogo = false;
    webComponent.toolbarCaptionsButton = false;
    webComponent.toolbarBackgroundEffectsButton = false;
    // webComponent.toolbarDisplaySessionName = true;
    // webComponent.streamDisplayParticipantName = true;
    // webComponent.streamDisplayAudioDetection = true;
    // webComponent.streamSettingsButton = true;
    webComponent.participantPanelItemMuteButton = true;

    webComponent.tokens = tokens;
}


/**
 * --------------------------------------------
 * GETTING A TOKEN FROM YOUR APPLICATION SERVER
 * --------------------------------------------
 * The methods below request the creation of a Session and a Token to
 * your application server. This keeps your OpenVidu deployment secure.
 *
 * In this sample code, there is no user control at all. Anybody could
 * access your application server endpoints! In a real production
 * environment, your application server must identify the user to allow
 * access to the endpoints.
 *
 * Visit https://docs.openvidu.io/en/stable/application-server to learn
 * more about the integration of OpenVidu in your application server.
 */

function getToken(customSessionId, tokenServerApp, interviewId, APPLICATION_SERVER_URL) {
    return createSession(customSessionId, tokenServerApp, interviewId, APPLICATION_SERVER_URL).then(sessionId => createToken(sessionId, tokenServerApp, APPLICATION_SERVER_URL));
}

function createSession(sessionId, tokenServerApp, interviewId, APPLICATION_SERVER_URL) {
    return new Promise((resolve, reject) => {
        $.ajax({
            type: "POST",
            url: APPLICATION_SERVER_URL + '/api/sessions/' + interviewId,
            data: JSON.stringify({customSessionId: sessionId}),
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + tokenServerApp
            },
            success: response => resolve(response), // The sessionId
            error: (error) => reject(error)
        });
    });
}

function createToken(sessionId, tokenServerApp, APPLICATION_SERVER_URL) {
    return new Promise((resolve, reject) => {
        $.ajax({
            type: 'POST',
            url: APPLICATION_SERVER_URL + '/api/sessions/' + sessionId + '/connections',
            data: JSON.stringify({}),
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ` + tokenServerApp
            },
            success: (response) => resolve(response), // The token
            error: (error) => reject(error)
        });
    });
}