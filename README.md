# Prodig-External-Extras

Provides a base package for other external task microservices to minimize update handling effort.

Includes the configuration of external task client,
logging of external task client and bunyan as logging engine.

All current settings from camunda-external-task-client-js are supported.
Variables should be used by setting on the process environment variables.

Through Gitlab CI runner it gets pushed to a private
npm repository which need to be available for
other external task microservices.