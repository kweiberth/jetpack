/**
 * External dependencies
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { translate as __ } from 'i18n-calypso';
import { isEmpty, get } from 'lodash';
import classNames from 'classnames';

/**
 * Internal dependencies
 */
import DashItem from 'components/dash-item';
import Card from 'components/card';
import { getSitePlan } from 'state/site';
import { isDevMode } from 'state/connection';
import { getSiteActivity } from 'state/activity';
//import { PLAN_JETPACK_BUSINESS, PLAN_JETPACK_BUSINESS_MONTHLY, PLAN_VIP } from 'lib/plans/constants';

class DashActivity extends Component {
	static propTypes = {
		inDevMode: PropTypes.bool.isRequired,
		siteRawUrl: PropTypes.string.isRequired,
		sitePlan: PropTypes.object.isRequired,
		siteActivity: PropTypes.array.isRequired,
	};

	static defaultProps = {
		inDevMode: false,
		siteRawUrl: '',
		sitePlan: '',
		siteActivity: [],
	};

	render() {
		const { inDevMode, siteActivity } = this.props;
		// const sitePlan = get( this.props.sitePlan, 'product_slug', 'jetpack_free' );
		// const hasBackups = includes( [ PLAN_JETPACK_BUSINESS, PLAN_JETPACK_BUSINESS_MONTHLY, PLAN_VIP ], sitePlan );
		// const maybeUpgrade = hasBackups
		// 	? __( "{{a}}View your site's activity{{/a}} in a single feed where you can see when events occur and rewind them if you need to.", {
		// 		components: {
		// 			a: activityLogLink
		// 		}
		// 	} )
		// 	: __( "{{a}}View your site's activity{{/a}} in a single feed where you can see when events occur and, {{plan}}with a plan{{/plan}}, rewind them if you need to.", {
		// 		components: {
		// 			a: activityLogLink,
		// 			plan: <a href={ `https://jetpack.com/redirect/?source=plans-main-bottom&site=${ siteRawUrl }` } />
		// 		}
		// 	} );

		// @todo: update this to use rewind text/CTA when available
		const months = [
			__( 'Jan' ),
			__( 'Feb' ),
			__( 'Mar' ),
			__( 'Apr' ),
			__( 'May' ),
			__( 'Jun' ),
			__( 'Jul' ),
			__( 'Aug' ),
			__( 'Sep' ),
			__( 'Oct' ),
			__( 'Nov' ),
			__( 'Dec' ),
		];
		const activityLogOnlyText = isEmpty( siteActivity ) ? (
			<p>
				{ __(
					'Jetpack keeps a complete record of everything that happens on your site, taking the guesswork out of site management, debugging, and repair.'
				) }
			</p>
		) : (
			<ul className="jp-dash-activity__list">
				{ siteActivity.map(
					( { summary, content: { text }, actor: { name, icon }, published }, index ) => {
						const dateTime = published.split( 'T' );
						dateTime[ 0 ] = dateTime[ 0 ].split( '-' );
						return (
							<li key={ `activity-event-${ index }` }>
								<time dateTime={ published } className="jp-dash-activity__date-time">
									<div className="jp-dash-activity__date">{ `${
										months[ parseInt( dateTime[ 0 ][ 1 ] ) ]
									} ${ dateTime[ 0 ][ 2 ] }` }</div>
									<div className="jp-dash-activity__time">
										{ dateTime[ 1 ].replace( /([:0-9]+):([\.+:0-9]+$)/, '$1' ) }
									</div>
								</time>
								<div className="jp-dash-activity__item">
									<div className="jp-dash-activity__event">{ text }</div>
									<div className="jp-dash-activity__details">
										<div className="jp-dash-activity__actor">
											{ icon && <img src={ get( icon, 'url', '' ) } alt="" /> }
											<span className="jp-dash-activity__actor-name">{ name }</span>
										</div>
										<div className="jp-dash-activity__summary">{ summary }</div>
									</div>
								</div>
							</li>
						);
					}
				) }
			</ul>
		);

		return (
			<div className="jp-dash-item__interior">
				<DashItem
					label={ __( 'Activity' ) }
					isModule={ false }
					className={ classNames( {
						'jp-dash-item__is-inactive': inDevMode,
					} ) }
					pro={ false }
				>
					<div className="jp-dash-item__description">
						{ inDevMode ? __( 'Unavailable in Dev Mode.' ) : activityLogOnlyText }
					</div>
				</DashItem>
				<Card
					key="view-activity"
					className="jp-dash-item__manage-in-wpcom"
					compact
					href={ `https://wordpress.com/activity-log/${ this.props.siteRawUrl }` }
				>
					{ __( 'View all site activity' ) }
				</Card>
			</div>
		);
	}
}

export default connect( state => ( {
	sitePlan: getSitePlan( state ),
	inDevMode: isDevMode( state ),
	siteActivity: getSiteActivity( state ),
} ) )( DashActivity );