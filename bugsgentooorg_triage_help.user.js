// ==UserScript==
// @name		bugs.gentoo.org triage helper
// @description		Adds links above the bugs.gentoo.org comment field for stock responses.
//			You will need a Mozilla browser and the Greasemonkey extension 
//			<http://greasemonkey.mozdev.org/index.html> 
//			installed to use this, or the Opera web browser.
// @author		Andre Klapper <aklapper@openismus.com>,
// @author		Christian Kirbach <Christian.Kirbach@googlemail.com> (Opera fixes)
// @author		Torsten Veller <tove@gentoo.org> (Gentoo modification)
// @version		2010-06-25
// @include		https://bugs.gentoo.org/show_bug.cgi?id=*
// @copyright		(C) Copyright Control by the authors, 2007 and later.
// @license		The contents of this file are subject to the Mozilla Public
//			License Version 1.1 (the "License"); you may not use this file
//			except in compliance with the License. You may obtain a copy of
//			the License at http://www.mozilla.org/MPL/
//			Software distributed under the License is distributed on an "AS
//			IS" basis, WITHOUT WARRANTY OF ANY KIND, either express or
//			implied. See the License for the specific language governing
//			rights and limitations under the License.
//			The Original Code is the Bugzilla Bug Tracking System.
//			Parts of this code come from the old GNOME Bugzilla 2.20 version located at
//			http://git.gnome.org/cgit/bugzilla-newer/tree/template/en/default/bug/edit.html.tmpl
//			The Initial Developer of the Original Code is Netscape Communications
//			Corporation. Portions created by Netscape are
//			Copyright (C) 1998 Netscape Communications Corporation. All
//			Rights Reserved.
//			Contributor(s): Gervase Markham <gerv@gerv.net>
//			                Vaskin Kissoyan <vkissoyan@yahoo.com>



/* HACKERS PLEASE NOTE:
 * 1) if you want to add individual stock responses for yourself, you have to add two things:
 *    a) an EventHandler function (like "FooClick") 
 *       to define the comment text and the bug resolution
 *    b) a createStockResponse() call at the end of this script that creates the stock
 *       response link on the webpage and calls the EventHandler function you defined in a)
 * 2) Note that the "addTextToComment" signature here is different from the one used at 
 *    bugzilla.gnome.org in /template/en/default/bug/edit.html.tmpl.
 */


/************************************************************/
/*find out which product/component the bug report is about: */
/************************************************************/
  var product = document.getElementById("product").value;
  var component = document.getElementById("component").value;


/*************************************************************/
/* set prefered height of some fields:                       */
/*************************************************************/
document.getElementById("comment").rows = 20;


/************************************************************************************/
/* if CC field is displayed (=you are not already on the CC list), then make sure   */
/* that the CC field is unchecked. this workaround is needed for some actions to    */
/* properly add yourself to the CC list - i prefer to CC myself on everything(TM)   */
/************************************************************************************/
if (document.getElementById("addselfcc") != null) {
  document.getElementById("addselfcc").checked = false;
}


/************************************************************/
/* some requirements for adding stock responses:            */
/************************************************************/

/* add a <div> container for the custom stock responses above the comment input field */
  var commentField = document.getElementById("comment");
  var individualDiv = document.createElement("div");
  individualDiv.setAttribute('id', "custom_div");
  var individualDivText = document.createTextNode(""); // "heading" for the div
  individualDiv.appendChild(individualDivText);
  individualDiv.setAttribute('style', "max-width:700px; border:0px solid #000000; padding: 5px 0 5px 0; margin: 2px 0px 2px; text-align: left; background-color:#DDDAEC");
  commentField.parentNode.insertBefore(individualDiv, commentField.nextSibling);



/*  function creates individual stock responses
 *  @param stockID some ID for the <span> to create
 *  @param linkTextDisplayed the link text to be displayed 
 *  @param clickHandler the name of the EventHandler function (function must have been defined before in this code)
 *  @return void
 */
function createStockResponse(stockID, linkTextDisplayed, clickHandler, bgcolor) {
    var SpanContainer = document.createElement("span");
    SpanContainer.setAttribute('id', stockID);
    var SpanContainerText = document.createTextNode(linkTextDisplayed);
    SpanContainer.appendChild(SpanContainerText);
    individualDiv.appendChild(SpanContainer);
    if (bgcolor == 1) {
      SpanContainer.setAttribute('style', "padding: 5px; margin-right: 5px; background-color: #F57900; cursor: pointer;");
    }
    else if (bgcolor == 2) {
      SpanContainer.setAttribute('style', "padding: 5px; margin-right: 5px; background-color: #73D216; cursor: pointer;");
    }
    else if (bgcolor == 3) {
      SpanContainer.setAttribute('style', "padding: 5px; margin-right: 5px; background-color: #729fcf; cursor: pointer;");
    }
    else if (bgcolor == 4) {
      SpanContainer.setAttribute('style', "padding: 5px; margin-right: 5px; background-color: #75507b; cursor: pointer; color: white;");
    }
    else /* if (bgcolor == 0) */ {
      SpanContainer.setAttribute('style', "padding: 5px; margin-right: 5px; cursor: pointer;");
    }
    SpanContainer.addEventListener("click", clickHandler, true);
}


/* function adds reply text to the comment textarea, enables the CC checkbox
 * and set keyboard focus to the submit button 
 * (shamelessly partially adopted from bugzilla.gnome.org code at 
 * /template/en/default/bug/edit.html.tmpl which is under a Mozilla Public License)
 * @param text text to add as a new comment
 * @param knob what to mark the bug report as (e.g. "duplicate" or "needinfo")
 * @param resolve string that describes the resolution (e.g. "incomplete" or "fixed")
 * @param crasher if "1", set priority and severity accordingly
 * @param ccme if "1", add me to the CC list of the bug
 * @return void
 */

function addTextToComment(text, knob, resolve, crasher, ccme, keyword) {
  /* pre id="comment_name_N" */
  /* make sure we split on all newlines -- IE or Moz use \r and \n
   * respectively */
    text = text.split(/\r|\n/);

    var replytext = "";
    for (var i=0; i < text.length; i++) {
        replytext += text[i] + "\n"; 
    }

    if (resolve && resolve != "") {
      knob = 'resolve';
      document.getElementsByName('resolution')[0].value = resolve;
    }

    if (knob && knob != "") {
      var radiobutton = document.getElementById('knob-' + knob);
      if (radiobutton) {radiobutton.checked = true;}
    }

    if (crasher == "1") {
      document.getElementsByName('priority')[0].value = 'High';
      document.getElementsByName('bug_severity')[0].value = 'critical';
    }

  /* enables the CC checkbox as we want to be informed when the reporter adds some info?: */
  if (ccme == "1" && document.getElementById("addselfcc") != null) {
    if (document.getElementById("addselfcc").checked == false) {
      document.getElementById("addselfcc").checked = true;
    }
  }

  /* add moreinfo keyword: */
  if (keyword && keyword != "") {
    if (document.getElementsByName('keywords')[0].value == "") {
      document.getElementsByName('keywords')[0].value = keyword;
    }
    else if ( !document.getElementsByName('keywords')[0].value.match(keyword) ) {
      document.getElementsByName('keywords')[0].value += ","+keyword;
    }
  }

  var textarea = document.getElementById('comment');
  textarea.value += replytext;

  /* auto-focus the "submit" button to save time */
  if (knob && knob == "duplicate") {
    if (document.getElementsByName('dup_id')[0] != null) {document.getElementsByName('dup_id')[0].focus();}
  }
  return false;
}


Date.prototype.toYYYYMMDDString = function () {return isNaN (this) ? 'NaN' : [this.getUTCFullYear(), this.getUTCMonth() > 8 ? this.getUTCMonth() + 1 : '0' + (this.getUTCMonth() + 1) , this.getUTCDate() > 9 ? this.getUTCDate() : '0' + this.getDate()].join('-');}

/****************************************************/
/* Gentoo mods                                      */
/****************************************************/

/* some general strings we use so often...: */
var textThanks = "Thanks for taking the time to report this issue.\n";

function EmergeInfo (Event) {
  var Text = textThanks + "\nPlease attach `emerge --info` to this bug report.";
  addTextToComment(Text, '', '', '1', '', '');
}

function DupClick (Event) {
  var Text = "This particular issue has already been reported in our bug tracking system. You will be automatically put into CC on the original bug.\nPlease feel free to report any further bugs you find, also feel encouraged to vote for the original bug report if interested.\n\nPlease be sure to search for existing reports first next time to avoid filing duplicates.";
  addTextToComment(Text, 'duplicate', '', '', '0', '');
}

function SunriseSuggested (Event) {
  var Text = "Hello, The Gentoo Team would like to firstly thank you for your ebuild\n\
submission. We also apologize for not being able to accommodate you in a timely\n\
manner. There are simply too many new packages.\n\
\n\
Allow me to use this opportunity to introduce you to Gentoo Sunrise. The\n\
sunrise overlay[1] is a overlay for Gentoo which we allow trusted users to\n\
commit to and all users can have ebuilds reviewed by Gentoo devs for entry\n\
into the overlay. So, the sunrise team is suggesting that you look into this\n\
and submit your ebuild to the overlay where even *you* can commit to. =)\n\
\n\
Thanks,\n\
On behalf of the Gentoo Sunrise Team\n\
\n\
  [1]: http://www.gentoo.org/proj/en/sunrise/\n\
  [2]: http://overlays.gentoo.org/proj/sunrise/wiki/SunriseFaq";
  addTextToComment(Text, 'reassign', '', '', '', 'EBUILD');
  if ( document.getElementById("assigned_to").value === 'bug-wranglers@gentoo.org' ) {
    document.getElementById("assigned_to").value = 'maintainer-wanted@gentoo.org';
  }
  if ( document.getElementsByName("status_whiteboard")[0].value && document.getElementsByName("status_whiteboard")[0].value != "" ) {
    if ( !document.getElementsByName("status_whiteboard")[0].value.match('sunrise-suggested') ) {
      document.getElementsByName("status_whiteboard")[0].value += ", sunrise-suggested";
    }
  } else {
    document.getElementsByName("status_whiteboard")[0].value = "sunrise-suggested";
  }
}

function RecruiterAnnounce (Event) {
  var Text = "I will be your recruiter. Please send your quizzes to recruiters@gentoo.org\nwhen approved by your mentor. Always add a comment to this bug when you send\nsomething to that address. When the quizzes are sent please contact me by IRC\nor email to schedule the first review session. If you think that recruiters\naren't paying attention to this bug at any later point in time, it's your job\nto ping us on IRC if you don't want any delays.\n";
  addTextToComment(Text, '', '', '', '', '');
}

function RecruiterSetup (Event) {
  var Text = "\
What we did:\n\
- LDAP\n\
- bugzilla\n\
- cvs/svn/git groups on cvs.gentoo.org\n\
- IRC cloak\n\
- sent you your LDAP/mail password via encrypted mail\n\
- announcement\n\
- gentoo-core\n\
\n\
What you need to do:\n\
- subscribe to mailing lists with your @gentoo.org address\n\
- request forum status bump in #gentoo-forums or by mail to\n\
  forum-mods@gentoo.org (if you have a forums account)\n\
- send yourself mail to check if it works\n\
- add yourself to mail aliases ( like java@gentoo.org )\n\
  see /var/mail/alias on dev.gentoo.org\n\
- ask team leads to add yourself to herds.xml for the herds you want to\n\
  join or do it yourself if you have the permission to do so\n\
- set lat and lon attributes in LDAP if you want others to know where\n\
  exactly you are located\n\
- set gentooIM if you want people to be able to contact you via other\n\
  means than email\n\
- If you want your blog to be syndicated to planet.gentoo.org, check\n\
  http://www.gentoo.org/proj/en/userrel/planet/index.xml\n\
- contact trustees@gentoo.org for Foundation membership (optional)\n\
\n\
For the mentor:\n\
- You are also responsible for the commits of your recruit during the first\n\
  month so you should watch the commits of your recruit via gentoo-commits\n\
  mailing list."
  addTextToComment(Text, '', '', '', '', '');
}

function RetireAddInfra (Event) {
  var Text = "We are proceeding with your retirement.\n\nThank you for all your hard work and if you ever find the time to get back,\njust reopen this bug.";
  addTextToComment(Text, '', '', '', '', '');
  var d = new Date().toYYYYMMDDString();
  document.getElementsByName("status_whiteboard")[0].value="infra-retire: " + d;
  if(!document.getElementById("newcc").value) {
      document.getElementById("newcc").value = "infra-bugs@gentoo.org";
  } else {
      document.getElementById("newcc").value += ", infra-bugs@gentoo.org";
  }
}

function NeedInfo (Event) {
  var Text = "Closing this bug report as no further information has been provided. Please reopen this bug if you can provide the information asked for.\nThanks!";
  addTextToComment(Text, '', 'NEEDINFO', '', '1', '');
}

function FixInGentoo (Event) {
  var Text = "This problem has been fixed in our software repository. The fix will be available on the mirrors soon. Thank you for your bug report.";
  addTextToComment(Text, '', 'FIXED', '', '', '');
}

/*******************************************************************/
/* now finally add our custom stock response links to the web page */
/*******************************************************************/
createStockResponse('fixingentoo', '[FixInGentoo]', FixInGentoo, 2 );
createStockResponse('duplicate1', '[Dup]', DupClick, 2);
createStockResponse('needinfo', '[NeedInfo]', NeedInfo, 2);
createStockResponse('moreinfo1', '[EmergeInfo]', EmergeInfo, 4);

//if (product == "Gentoo Linux" && component == "Ebuilds") {
if (product == "Gentoo Linux") {
  createStockResponse('sunrise_suggested','[Sunrise-Suggested]', SunriseSuggested, 1);
}

if (product == "Gentoo Developers/Staff") {
  if (component == "Retirement") {
    createStockResponse('retireaddinfra','[Retire-AddInfra]', RetireAddInfra, 1);
  }
  if (component == "New Developers") {
    createStockResponse('recruiterannounce','[RecruiterAnnounce]', RecruiterAnnounce, 1 );
    createStockResponse('recruitersetup','[RecruiterSetup]', RecruiterSetup, 1 );
  }
}
