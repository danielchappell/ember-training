import Ember from 'ember';

export function initialize() {
    Ember.$.ajaxSetup({
        xhrFields: {
            withCredentials: true
        },
        crossDomain: true
    });
}

export default {
    name: 'ajax-setup',
    initialize: initialize
};
