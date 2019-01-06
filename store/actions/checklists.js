import 'isomorphic-unfetch';

import { checklistsTypes } from '../types.js';
import { pending, rejected, fulfilled } from '../helpers/asyncActionGenerator.js';

import { systemChecklists, customChecklists } from '../../mock/checklists';

export function getSystemChecklists() {
	return async (dispatch, getState) => {
		dispatch(pending(checklistsTypes.GET_SYSTEM_CHECKLISTS));

		/* TODO: Replace with API */
		await fetch('https://jsonplaceholder.typicode.com/users')
			.then(res => dispatch(fulfilled(checklistsTypes.GET_SYSTEM_CHECKLISTS, systemChecklists)))
			.catch(err => dispatch(rejected(checklistsTypes.GET_SYSTEM_CHECKLISTS, err)));
	}
}

export function getCustomChecklists() {
	return (dispatch, getState) => {
		dispatch(pending(checklistsTypes.GET_CUSTOM_CHECKLISTS));

		/* TODO: Replace with API */
		fetch('https://jsonplaceholder.typicode.com/users')
			.then(res => dispatch(fulfilled(checklistsTypes.GET_CUSTOM_CHECKLISTS, customChecklists)))
			.catch(err => dispatch(rejected(checklistsTypes.GET_CUSTOM_CHECKLISTS, err)));
	}
}