# Prodig-External-Deps

Provides a base package for other external task microservices to minimize update handling effort.

Includes the configuration of external task client,
logging of external task client and bunyan as logging engine.

All current settings from camunda-external-task-client-js are supported.
Variables should be used by setting on the process environment variables.

`The library is not intended to be used standalone.`

I use this in the following projects:

[prodig-external-mail-sender](https://github.com/kai-raschke/prodig-external-mail-sender) \
Microservice for sending emails from Camunda WFMS as external service