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

import DevicesOtherIcon from '@material-ui/icons/DevicesOther';
import SettingsPhoneIcon from '@material-ui/icons/SettingsPhone';
import BusinessCenterIcon from '@material-ui/icons/BusinessCenter';
import PeopleIcon from '@material-ui/icons/People';
import AccessibilityIcon from '@material-ui/icons/Accessibility';
import BusinessIcon from '@material-ui/icons/Business';
import LocalHospitalIcon from '@material-ui/icons/LocalHospital';
import LanguageIcon from '@material-ui/icons/Language';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';

import Layout from '../components/layout';

import { contentStyles } from '../utils/view';

const menuWidth = 300;

const styles = theme => ({
	wrapper: {
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
	menuListSubItem: {
		paddingLeft: theme.spacing.unit * 3,
	},
	...contentStyles(theme),
});

const mockSubList = ['Preparation', 'Borders', 'Vehicles', 'Checkpoints', 'Kidnapping'];

const menuList = [
	{name: 'Information', icon: (color) => <DevicesOtherIcon color={color} />, subList: mockSubList},
	{name: 'Communications', icon: (color) => <SettingsPhoneIcon color={color} />, subList: mockSubList},
	{name: 'Travel', icon: (color) => <BusinessCenterIcon color={color} />, subList: mockSubList},
	{name: 'Operations', icon: (color) => <PeopleIcon color={color} />, subList: mockSubList},
	{name: 'Personal', icon: (color) => <AccessibilityIcon color={color} />, subList: mockSubList},
	{name: 'Emergency Support', icon: (color) => <BusinessIcon color={color} />, subList: mockSubList},
	{name: 'Tools', icon: (color) => <LocalHospitalIcon color={color} />, subList: mockSubList},
	{name: 'Glossary', icon: (color) => <LanguageIcon color={color} />, subList: mockSubList},
];

class Lessons extends React.Component {
	static async getInitialProps({req}) {
		if (!process.browser) {
			const categoriesReq = await fetch('https://api.secfirst.org/v1/categories', {mode: "cors"});
			const categories = await categoriesReq.json();

			return {
				categories
			};
		}
	}

	state = {
		menuItemSelected: null,
		lessonSelected: null,
	};

	handleMenuItemSelect = menuItemIndex => {
		if (menuItemIndex == this.state.menuItemSelected) this.setState({menuItemSelected: null});
		else this.setState({menuItemSelected: menuItemIndex});
	}

	renderMenuList = () => {
		const { classes, lessonsMenuOpened } = this.props;

		return (
			<List
				component="nav"
				className={classes.menuList}
				className={classNames(classes.menuList, {
					[classes.menuListOpened]: lessonsMenuOpened,
				})}
			>
				{menuList.map((item, i) => {
					const isSelected = this.state.menuItemSelected == i;

					return (
						<div key={i} className={isSelected ? classes.menuListItemSelected : ''}>
							<ListItem button onClick={() => this.handleMenuItemSelect(i)}>
								<ListItemIcon>
									{item.icon(isSelected ? 'primary' : 'inherit')}
								</ListItemIcon>
								<ListItemText inset primary={item.name} />
								{isSelected ? <ExpandLess /> : <ExpandMore />}
							</ListItem>
							<Collapse in={isSelected} timeout="auto" unmountOnExit>
								<List component="div" disablePadding>
									{item.subList.map((subItem, i) => {
										return (
											<ListItem button className={classes.menuListSubItem} key={i}>
												<ListItemText inset primary={subItem} />
											</ListItem>
										);
									})}
								</List>
							</Collapse>
						</div>
					);
				})}
			</List>
		);
	}

	render() {
		const { classes } = this.props;
		console.log("this.props.categories: ", this.props.categories);

		return (
			<Layout title="Umbrella | Lessons" description="Umbrella web application">
				<div className={classes.wrapper}>
					{this.renderMenuList()}

					<div className={classes.content}>

						<Typography paragraph>
							<strong>LESSON</strong> Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
							incididunt ut labore et dolore magna aliqua. Rhoncus dolor purus non enim praesent
							elementum facilisis leo vel. Risus at ultrices mi tempus imperdiet. Semper risus in
							hendrerit gravida rutrum quisque non tellus. Convallis convallis tellus id interdum
							velit laoreet id donec ultrices. Odio morbi quis commodo odio aenean sed adipiscing.
							Amet nisl suscipit adipiscing bibendum est ultricies integer quis. Cursus euismod quis
							viverra nibh cras. Metus vulputate eu scelerisque felis imperdiet proin fermentum leo.
							Mauris commodo quis imperdiet massa tincidunt. Cras tincidunt lobortis feugiat vivamus
							at augue. At augue eget arcu dictum varius duis at consectetur lorem. Velit sed
							ullamcorper morbi tincidunt. Lorem donec massa sapien faucibus et molestie ac.
						</Typography>
					</div>
				</div>
			</Layout>
		);
	}
}

const mapStateToProps = state => ({...state.view});

export default connect(mapStateToProps)(withStyles(styles, { withTheme: true })(Lessons));