'use strict';
const logParent = require('./log'),
    log         = logParent.child({component: 'camunda-external-client'});

module.exports = function(client){
    client.on("subscribe", topic => {
        log.info('Subscribed ' + topic);
    });

    client.on("unsubscribe", topic => {
        log.info('Unsubscribed ' + topic);
    });

    client.on("poll:start", () => {
        log.info('polling');
    });

    client.on("poll:stop", () => {
        log.error("X-Camunda-PollError: stopped");
    });

    client.on("poll:success", tasks => {
        log.info('task ' + tasks);
    });

    client.on("poll:error", e => {
        log.error('X-Camunda-PollError: ' + e);
    });

    client.on("complete:success", ({ id }) => {
        log.info(`completed task ${id}`);
    });

    client.on("complete:error", ({ id }, e) => {
        log.error(`X-Camunda-CompleteError: couldn't complete task ${id}, ${e}`);
    });

    client.on("handleFailure:success", ({ id }) => {
        log.info(`handled failure of task ${id}`);
    });

    client.on("handleFailure:error", ({ id }, e) => {
        log.error(`X-Camunda-FailureError: couldn't handle failure of task ${id}, ${e}`);
    });

    client.on("handleBpmnError:success", ({ id }) => {
        log.info(`handled BPMN error of task ${id}`);
    });

    client.on("handleBpmnError:error", ({ id }, e) => {
        log.error(`X-Camunda-BpmnError: couldn't handle BPMN error of task ${id}, ${e}`);
    });

    client.on("extendLock:success", ({ id }) => {
        log.info(`handled extend lock of task ${id}`);
    });

    client.on("extendLock:error", ({ id }, e) => {
        log.error(`X-Camunda-ExtendLockError: couldn't handle extend lock of task ${id}, ${e}`);
    });

    client.on("unlock:success", ({ id }) => {
        log.info(`unlocked task ${id}`);
    });

    client.on("unlock:error", ({ id }, e) => {
        log.error(`X-Camunda-UnlockError: couldn't unlock task ${id}, ${e}`);
    });
};