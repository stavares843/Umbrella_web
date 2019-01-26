import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';

import Layout from '../../components/layout';
import Loading from '../../components/reusables/Loading';
import ErrorMessage from '../../components/reusables/ErrorMessage';
import AddButton from '../../components/reusables/AddButton';

import { contentStyles, paperStyles, buttonWrapperStyles } from '../../utils/view';

import { getFormTypes, getForms } from '../../store/actions/forms';

const styles = theme => ({
	...contentStyles(theme),
	label: {
		color: theme.palette.grey[500],
		fontSize: '.875rem',
	},
	formPanel: {
		margin: '.75rem 0',
		...paperStyles(theme),
	},
	formPanelButtonsWrapper: {
		...buttonWrapperStyles(theme),
	},
});

class Forms extends React.Component {
	static async getInitialProps({reduxStore}) {
		await reduxStore.dispatch(getFormTypes());
		await reduxStore.dispatch(getForms());
	}

	handleEdit = (form) => () => {
		alert("Edit " + form.typeId);
	}

	handleShare = (form) => () => {
		alert("Sharing " + form.typeId);
	}

	renderPanel = (form, i, isActive) => {
		const { classes, formTypes } = this.props;

		const formType = formTypes.find(type => type.id === form.typeId);

		return (
			<Paper key={i} className={classes.formPanel} square>
				<Typography variant="h6">{formType.title}</Typography>
				<Typography paragraph>{formType.description}</Typography>

				{!!isActive && <div className={classes.formPanelButtonsWrapper}>
					<Button component="button" onClick={this.handleEdit(form)}>Edit</Button>
					<Button color="primary" onClick={this.handleShare(form)}>Share</Button>
				</div>}
			</Paper>
		);
	}

	renderContent = () => {
		const { classes, getFormTypesLoading, getFormTypesError, formTypes, getFormsLoading, getFormsError, forms } = this.props;

		if (getFormTypesLoading || getFormsLoading) return <Loading />;
		else if (getFormTypesError || getFormsError) return <ErrorMessage error={getFormTypesError || getFormsError} />;

		let sorted = forms.reduce((set, form) => {
			if (!set[form.status]) set[form.status] = [];
			set[form.status].push(form);
			return set;
		}, {});

		return (
			<div className={classes.content}>
				{(!!sorted.active && !!sorted.active.length) && <Typography className={classes.label} variant="subtitle1">Active</Typography>}

				{(!!sorted.active && !!sorted.active.length) && sorted.active.map((form, i) => this.renderPanel(form, i, true))}

				{(!!sorted.completed && !!sorted.completed.length) && <Typography className={classes.label} variant="subtitle1">All</Typography>}

				{(!!sorted.completed && !!sorted.completed.length) && sorted.completed.map((form, i) => this.renderPanel(form, i))}
			</div>
		);
	}

	render() {
		const { classes } = this.props;

		return (
			<Layout title="Umbrella | Forms" description="Umbrella web application">
				{this.renderContent()}

				<AddButton href="/forms/new" />
			</Layout>
		);
	}
}

const mapStateToProps = state => ({
	...state.forms,
});

export default connect(mapStateToProps)(withStyles(styles, { withTheme: true })(Forms));