/**
 * @license
 * Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */

import { LitElement, html } from '@polymer/lit-element/lit-element';
import { connect } from 'pwa-helpers/connect-mixin';
import { fetchUser, fetchUserIfNeeded } from '../actions/users';
import users, { currentUserSelector } from '../reducers/users';
import { store } from '../store';
import { sharedStyles } from './shared-styles';
import './hn-loading-button';

store.addReducers({
  users,
});

export class HnUserElement extends connect(store)(LitElement) {
  render({ user }) {
    return html`
    <style>${sharedStyles}</style>
    <style>
      table {
        margin: 1em 0;
      }
    </style>
    <hn-loading-button
        loading="${user.isFetching}"
        on-click="${() => store.dispatch(fetchUser(user))}">
    </hn-loading-button>
    <table hidden="${user.failure}">
      <tr>
        <td>User:</td><td>${user.id}</td>
      </tr>
      <tr>
        <td>Created:</td><td>${user.created}</td>
      </tr>
      <tr>
        <td>Karma:</td><td>${user.karma}</td>
      </tr>
    </table>
    ${user.failure ? html`<p>User not found</p>` : ''}
    `;
  }

  static get properties() {
    return {
      user: Object
    }
  }

  stateChanged(state) {
    const user = currentUserSelector(state);
    if (user) {
      document.title = user.id;
      this.user = user;
    }
  }
}

customElements.define('hn-user', HnUserElement);

export { currentUserSelector, fetchUserIfNeeded };
