import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import 'isomorphic-unfetch';

import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Collapse from '@material-ui/core/Collapse';
import Fab from '@material-ui/core/Fab';

import BookmarkIcon from '@material-ui/icons/Bookmark';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';

import Layout from '../../components/layout';
import Loading from '../../components/reusables/Loading';
import ErrorMessage from '../../components/reusables/ErrorMessage';
import LessonsFavorites from '../../components/lessons/LessonsFavorites';
import LessonLevel from '../../components/lessons/LessonLevel';
import LessonsContent from '../../components/lessons/LessonsContent';
import LessonCard from '../../components/lessons/LessonCard';

import yellow from '@material-ui/core/colors/yellow';

import { contentStyles } from '../../utils/view';

import { 
	getLessons, 
	getLessonFile, 
	getLessonsFavorites, 
	setLessonsGlossaryIndex 
} from '../../store/actions/lessons';

import { 
	setLessonsContentType, 
	setLessonsContentPath, 
	toggleLessonFileView, 
	toggleLessonsFavoritesView 
} from '../../store/actions/view';


const menuWidth = 300;

const glossaryIndex = ['A-D', 'E-H', 'I-L', 'M-P', 'Q-T', 'U-Z'];

const styles = theme => ({
	...contentStyles(theme, {
		width: '100%',
	}),
	wrapper: {
		position: 'relative',
		display: 'flex',
		flex: 1,
		height: '100%',
	},
	menuList: {
		width: menuWidth,
		flexShrink: 0,
		height: '100%',
		whiteSpace: 'nowrap',
		backgroundColor: theme.palette.background.paper,
		overflow: 'hidden',
		transition: theme.transitions.create(['width'], {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.leavingScreen * 5,
		}),
	},
	menuListOpened: {
		width: menuWidth,
		transition: theme.transitions.create(['width'], {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.enteringScreen * 5,
		}),
	},
	menuListItemSelected: {
		borderTop: '1px solid ' + theme.palette.grey[300],
		borderBottom: '1px solid ' + theme.palette.grey[300],
	},
	menuListItemIcon: {
		display: 'block',
	},
	menuListItemIconImg: {
		width: '1.5rem',
		opacity: '.825',
	},
	menuListItemMUIIcon: {
		fill: '#000',
		opacity: '.825',
	},
	menuListItemText: {
		textTransform: 'capitalize',
	},
	menuListSubItem: {
		paddingLeft: theme.spacing.unit * 3,
	},
	level: {
		color: 'white',
		cursor: 'initial',
		[theme.breakpoints.up('sm')]: {
			marginLeft: '.5rem',
			marginBottom: '1rem',
		},
		[theme.breakpoints.up('md')]: {
			position: 'absolute',
			top: '2rem',
			left: '2rem',
		},
	},
	beginner: {
		backgroundColor: theme.palette.secondary.main,
		'&.hover': {
			backgroundColor: theme.palette.secondary.main,
		},
	},
	advanced: {
		backgroundColor: yellow[700],
		'&.hover': {
			backgroundColor: yellow[700],
		},
	},
	expert: {
		backgroundColor: theme.palette.primary.main,
		'&.hover': {
			backgroundColor: theme.palette.primary.main,
		},
	},
});

class Lessons extends React.Component {
	static async getInitialProps({isServer, reduxStore}) {
		await reduxStore.dispatch(getLessons());
		return isServer;
	}

	state = {
		categorySelected: null,
		subcategorySelected: null,
		lessonSelected: null,
	}

	handleFavoritesSelect = () => {
		const { dispatch, lessonsFavoritesView } = this.props;

		// dispatch(getLessonsFavorites());

		if (!lessonsFavoritesView) {
			dispatch(toggleLessonsFavoritesView(true));
		}
	}

	handleCategorySelect = category => e => {
		const { dispatch, lessons, locale } = this.props;
		const keys = Object.keys(lessons[locale][category]);

		if (category !== 'glossary' && keys.length === 1 && keys[0] === "content") {
			const file = lessons[locale][category].content.find(file => file.filename.indexOf('.md') > -1);

			dispatch(toggleLessonsFavoritesView(false));
			dispatch(toggleLessonFileView(true));
			dispatch(getLessonFile(file.sha));
		} else {
			if (category == this.state.categorySelected) this.setState({categorySelected: null});
			else this.setState({categorySelected: category});
		}
	}

	handleSubcategorySelect = subcategory => e => {
		const { dispatch, lessons } = this.props;
		const { categorySelected } = this.state;

		dispatch(toggleLessonsFavoritesView(false));
		dispatch(toggleLessonFileView(false));

		this.setState(
			{subcategorySelected: subcategory}, 
			() => {
				dispatch(setLessonsContentType('levels'));
				dispatch(setLessonsContentPath(`${categorySelected}.${subcategory}`));
			}
		);
	}

	handleGlossarySelect = index => () => {
		const { dispatch } = this.props;
		
		dispatch(toggleLessonsFavoritesView(false));
		dispatch(setLessonsGlossaryIndex(index));
		dispatch(setLessonsContentType('levels'));
		dispatch(setLessonsContentPath(`glossary.${index}`));

		this.setState({subcategorySelected: 'glossary'});
	}

	renderLevel = () => {
		const { classes, currentLesson } = this.props;

		return (
			<Fab 
				className={classNames(classes.level, classes[currentLesson.level])} 
				component="div"
				variant="extended"
				disableFocusRipple
				disableRipple
			>{currentLesson.level}</Fab>
		);
	}

	renderMenuGlossary = isSelected => {
		const { classes } = this.props;

		return (
			<Collapse in={isSelected} timeout="auto" unmountOnExit>
				<List component="div" disablePadding>
					{glossaryIndex.map((index, i) => (
						<ListItem button className={classes.menuListSubItem} key={i} onClick={this.handleGlossarySelect(index)}>
							<ListItemText className={classes.menuListItemText} inset primary={index} />
						</ListItem>
					))}
				</List>
			</Collapse>
		);
	}

	renderMenuSubcategories = (subcategories, isSelected) => {
		const { classes } = this.props;
		const { subcategorySelected } = this.state;

		return (
			<Collapse in={isSelected} timeout="auto" unmountOnExit>
				<List component="div" disablePadding>
					{subcategories.map((subcategory, i) => (
						<ListItem 
							key={i} 
							className={classes.menuListSubItem} 
							onClick={this.handleSubcategorySelect(subcategory)} 
							button 
						>
							<ListItemText className={classes.menuListItemText} inset primary={subcategory.replace(/-/g, ' ')} />
						</ListItem>
					))}
				</List>
			</Collapse>
		);
	}

	renderMenuCategory = (category, i) => {
		const { classes, lessons, locale } = this.props;
		const { categorySelected } = this.state;

		if (category == "content" || category == "forms") return null;

		const isSelected = categorySelected == category;
		const isGlossary = category === 'glossary';
		const subcategories = Object.keys(lessons[locale][category]).filter(subcategory => subcategory != "content");

		return (
			<div key={i} className={isSelected ? classes.menuListItemSelected : ''}>
				<ListItem button onClick={this.handleCategorySelect(category)}>
					<ListItemIcon className={classes.menuListItemIcon}>
						<img className={classes.menuListItemIconImg} src={`/static/assets/content/${locale}/${category}/${category}.png`} />
					</ListItemIcon>
					<ListItemText className={classes.menuListItemText} inset primary={category.replace(/-/g, ' ')} />

					{(isGlossary || !!subcategories.length)
						? isSelected ? <ExpandLess /> : <ExpandMore />
						: null
					}
				</ListItem>

				{isGlossary 
					? this.renderMenuGlossary(isSelected)
					: !!subcategories.length
						? this.renderMenuSubcategories(subcategories, isSelected)
						: null
				}
			</div>
		);
	}

	renderMenuList = () => {
		const { classes, lessonsMenuOpened, getLessonsLoading, getLessonsError, lessons, currentLesson, locale } = this.props;
		const { categorySelected } = this.state;

		if (getLessonsLoading) return <Loading />;
		else if (getLessonsError) return <ErrorMessage error={getLessonsError} />;
		else if (currentLesson) return null;

		return (
			<List
				component="nav"
				className={classes.menuList}
				className={classNames(classes.menuList, {
					[classes.menuListOpened]: lessonsMenuOpened,
				})}
			>
				{/* Favorites menu item */}
				<div className={categorySelected == "favorites" ? classes.menuListItemSelected : ''}>
					<ListItem button onClick={this.handleFavoritesSelect}>
						<ListItemIcon className={classes.menuListItemIcon}>
							<BookmarkIcon className={classes.menuListItemMUIIcon} />
						</ListItemIcon>
						<ListItemText className={classes.menuListItemText} inset primary="Favorites" />
					</ListItem>
				</div>

				{Object.keys(lessons[locale]).map(this.renderMenuCategory)}
			</List>
		);
	}

	renderContent = () => {
		const { currentLesson, lessonsFavoritesView, lessonFileView } = this.props;

		if (lessonsFavoritesView) return <LessonsFavorites />;
		else if (lessonFileView) return <LessonCard />;
		else if (currentLesson) return <LessonLevel />;
		else return <LessonsContent />;
	}

	render() {
		const { classes, lessonsContentType, currentLesson } = this.props;

		return (
			<Layout title="Umbrella | Lessons" description="Umbrella web application">
				<div className={classes.wrapper}>
					{!currentLesson && this.renderMenuList()}

					<div className={classes.content}>
						{(!!currentLesson && !!currentLesson.level) && this.renderLevel()}

						{this.renderContent()}
					</div>
				</div>
			</Layout>
		);
	}
}

const mapStateToProps = state => ({
	...state.view,
	...state.lessons,
});

export default connect(mapStateToProps)(withStyles(styles, { withTheme: true })(Lessons));