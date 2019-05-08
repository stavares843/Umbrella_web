import merge from 'lodash.merge'
import Crypto from '../../utils/crypto'

import { accountTypes, feedsTypes, formsTypes, checklistsTypes, lessonsTypes, dbTypes } from '../types.js'
import { pending, rejected, fulfilled } from '../helpers/asyncActionGenerator.js'

import { clearPassword } from './account'
import { clearFeeds } from './feeds'
import { clearForms } from './forms'
import { clearChecklists } from './checklists'
import { clearLessons } from './lessons'

export const syncDb = () => async (dispatch, getState) => {
	await dispatch(pending(dbTypes.SYNC_DB))

	try {
		const state = getState()

		const ClientDB = require('../../db')
		const Account = require('../../account')

		const enabled = await ClientDB.default.get('enabled')
		const hash = await ClientDB.default.get('h')
		const password = await Account.default.password()

		if (!enabled || !hash || !password) return await dispatch(rejected(dbTypes.SYNC_DB, 'DB sync failed to authenticate'))

		try {
			let feedLocation = await ClientDB.default.get('fe_l', password, true)
			let feedSources = await ClientDB.default.get('fe_s', password, true)
			let rssSources = await ClientDB.default.get('rs_s', password, true)
			let formsSaved = await ClientDB.default.get('fo_s', password, true)
			let checklistsSystem = await ClientDB.default.get('ch_s', password, true)
			let checklistsCustom = await ClientDB.default.get('ch_c', password, true)
			let lessonCardsFavorites = await ClientDB.default.get('le_f', password, true)

			let feedsMerge = {}
			let formsMerge = {}
			let checklistsMerge = {}
			let lessonsMerge = {}

			if (feedLocation) feedsMerge.feedLocation = feedLocation
			if (feedSources) feedsMerge.feedSources = feedSources
			if (rssSources) feedsMerge.rssSources = rssSources

			if (formsSaved) formsMerge.formsSaved = formsSaved

			if (checklistsSystem) checklistsMerge.checklistsSystem = checklistsSystem
			if (checklistsCustom) checklistsMerge.checklistsCustom = checklistsCustom

			if (lessonCardsFavorites) lessonsMerge.lessonCardsFavorites = lessonCardsFavorites

			if (Object.keys(feedsMerge).length) {
				await dispatch({
					type: feedsTypes.SYNC_FEEDS, 
					payload: merge(state.feeds, feedsMerge)
				})
			}

			if (Object.keys(formsMerge).length) {
				await dispatch({
					type: formsTypes.SYNC_FORMS, 
					payload: merge(state.forms, formsMerge)
				})
			}

			if (Object.keys(checklistsMerge).length) {
				await dispatch({
					type: checklistsTypes.SYNC_CHECKLISTS, 
					payload: merge(state.checklists, checklistsMerge)
				})
			}

			if (Object.keys(lessonsMerge).length) {
				await dispatch({
					type: lessonsTypes.SYNC_LESSONS, 
					payload: merge(state.lessons, lessonsMerge)
				})
			}

			return await dispatch(fulfilled(dbTypes.SYNC_DB))
		} catch (e) {
			return await dispatch(rejected(dbTypes.SYNC_DB, e))
		}
	} catch (e) {
		return await dispatch(rejected(dbTypes.SYNC_DB, e))
	}
}

export const clearDb = () => async (dispatch, getState) => {
	await dispatch(pending(dbTypes.CLEAR_DB))

	try {
		const ClientDB = require('../../db')

		await ClientDB.default.clear()

		alert('Database has been cleared.')

		await dispatch(clearPassword())
		await dispatch(clearFeeds())
		await dispatch(clearForms())
		await dispatch(clearChecklists())
		await dispatch(clearLessons())
		
		await dispatch(fulfilled(dbTypes.CLEAR_DB))
	} catch (e) {
		await dispatch(rejected(dbTypes.CLEAR_DB, e))
	}
}