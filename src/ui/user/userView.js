// import userPerfs from '../../oyunkeyf/perfs';
import perf from '../shared/perf';
import { header as headerWidget, backButton } from '../shared/common';
import layout from '../layout';
import i18n from '../../i18n';
import helper from '../helper';
import session from '../../session';

export default function view(ctrl) {
  const user = ctrl.user();

  if (!user) return null;

  function header() {
    const title = user.username;
    return headerWidget(null, backButton(title));
  }

  function profile() {
    // TODO
    // stats
    // ratings
    // actions
    return (
      <div id="userProfile" className="native_scroller page">
        {renderStatus(user)}
        {renderProfile(user)}
        {renderRatings(user)}
        {renderActions(ctrl)}
      </div>
    );
  }

  return layout.free(header, profile);
}

function renderStatus(user) {
  const status = user.online ? 'online' : 'offline';
  return (
    <section className="onlineStatus">
      <span className={'userStatus ' + status} data-icon='r' />
      {i18n(status)}
    </section>
  );
}

function renderProfile(user) {
  if (!user.profile) return null;
  
  let fullName = '';
  if (user.profile.firstName) fullName += user.profile.firstName;
  if (user.profile.lastName) fullName += (user.profile.firstName ? ' ' :'') + user.profile.lastName;
  // const country = countries[user.profile.country];
  const location = user.profile.location;
  const memberSince = i18n('memberSince') + ' ' + window.moment(user.createdAt).format('LL');
  const seenAt = user.seenAt ? i18n('lastLogin') + ' ' + window.moment(user.seenAt).calendar() : null;

  return (
    <section classname="profile">
      {fullName ?
       <h3 className="fullname">{fullName}</h3>: null
      }
      {user.profile.bio ?
       <p className="profileBio">{user.profile.bio}</p>: null
      }
       <div className="userInfos">
         {
           user.language ?
           <p className="language withIcon">
             <span className="fa fa-comment-o">
               {getLanguageNativeName(user.language)}
             </span>
           </p> : null
         }
           <p className="location">{location}</p>
           <p className="memberSince">{memberSince}</p>
           {seenAt ?
            <p className="lastSeen">{seenAt}</p>: null
           }
       </div>
    </section>
  );
}

function renderRatings(user) {
  function isShowing(p) {
    return [
      'yuzbir', 'duzokey'
    ].indexOf(p.key)!== -1 || p.perf.games > 0;
  }

  return (
    <section id="userProfileRatings" className="perfs">
      // {userPerfs(user).filter(isShowing).map(p => perf(p.key, p.name, p.perf, user))}
    </section>
  );
}

function renderActions(ctrl) {
  const user = ctrl.user();
  return (
    <section id="userProfileActions" class="noPadding">
      <div className="list_item_nav"
           config={helper.ontouchY(ctrl.goToGames)}
           key="view_all_games">
        {i18n('viewAllNbGames', user.count.all)}
      </div>
    </section>
  );
}
