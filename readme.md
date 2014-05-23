Eventure Sports 3.0
===================

## External Services
The following external services are required to provide full functionality.

### /api/team/registration
Handles registering a team and the initial payment.  

- Methods Accepted: POST

#### POST
+ Data params:
``````
{
    token : [string],
    eventureId : [id],
    eventureListId : [id],
    participantId : [id],
    teamName : [string],
    teamMembers : [Array: {name : [string], email : [string]}],
    payment : [number]
}
``````
+ Response:
``````
{
    teamId : [id]
}
``````

### /api/team/:teamId/member/:memberId/payment
Handles paying a partial (or full) team fee.

- Methods Accepted: POST

#### POST
+ Data params:
``````
{
    token : [string],
    eventureId : [id],
    eventureListId : [id],
    teamId : [id],
    memberId : [id],
    participantId : [id],
    payment : [number]
}
``````
