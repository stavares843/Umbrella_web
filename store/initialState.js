const content = {
	getContentLoading: true,
	getContentError: null,
	content: null,
}

const account = {
	loginLoading: false,
	loginError: null,
	logoutLoading: false,
	logoutError: null,
	password: null,
	savePasswordLoading: false,
	savePasswordError: null,
	savePasswordSuccess: false,
}

const feeds = {
	loading: true,
	error: null,
	feeds: [],
	feedLocation: null,
	feedSources: [],
	getRssLoading: true,
	getRssError: null,
	rss: [],
	rssSources: [
		'https://threatpost.com/feed/',
		'https://krebsonsecurity.com/feed/',
		'https://www.aljazeera.com/xml/rss/all.xml',
		'https://www.theguardian.com/world/rss',
	],
}

const forms = {
	getFormLoading: true,
	getFormError: null,
	form: null,
	postFormLoading: false,
	postFormError: null,
	postFormSuccess: false,
}

const lessons = {
	currentLesson: null,
	lessonsGlossaryIndex: null,
	getLessonChecklistLoading: false,
	getLessonChecklistError: null,
	currentLessonChecklist: null,
	getLessonFileLoading: true,
	getLessonFileError: null,
	currentLessonFile: null,
}

const checklists = {
	getChecklistsSystemLoading: true,
	getChecklistsSystemError: null,
	checklistsSystem: {},
	getChecklistsCustomLoading: true,
	getChecklistsCustomError: null,
	getChecklistsCustomSuccess: false,
	checklistsCustom: [],
}

const view = {
	mainMenuOpened: false,
	appbarTitle: null,
	lessonsMenuOpened: 0,
	lessonsContentType: null,
	lessonsContentPath: null,
	lessonsFavoritesView: false,
	lessonFileView: false,
	locale: 'en',
}

const db = {
	loading: true,
	error: null,
}

export default {
	content,
	account,
	feeds,
	forms,
	lessons,
	checklists,
	view,
	db,
}