/*
    @title      UnEMR
    @update     Apr 6, 2021
    @author     Raphael Nelo Aguila
    @email      raphaelnelo.aguila@gmail.com
    @github     raphaelnelo.aguila@gmail.com
    @builder    https://builder.knack.com/jong/unemr1-play
*/

const UnEMR = (data) => {
  const {APP_ID, API_KEY, STORAGE} = data;

  function updateIsUnreadField(d) {
    var object_id = 'object_76';
    var record_id = d.id;
    var is_unread_field = 'field_734';
    var req_url = "https://api.knack.com/v1/objects/" + object_id + "/records/" + record_id;

    var data = { [is_unread_field]: false };

    /* 
        I can't get this to work...
    */
    // $.ajax({
    //     type: 'put',
    //     url: req_url,
    //     headers: {
    //         'X-Knack-Application-Id': APP_ID,
    //         'X-Knack-REST-API-KEY': API_KEY,
    //         'Content-Type': 'application/json'
    //     },
    //     data,
    //     dataType: 'json',
    //     success: (status, results) => {
    //         console.log(status);
    //         console.log(results);
    //     },
    //     error: (jqXhr, results, err) => {
    //         console.log(jqXhr);
    //         console.log(results);
    //         console.log(err);
    //     }
    // });

    var xhr = new XMLHttpRequest();

    xhr.open('PUT', req_url, false);
    xhr.setRequestHeader('X-Knack-Application-Id', APP_ID);
    xhr.setRequestHeader('X-Knack-REST-API-KEY', API_KEY);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.addEventListener('load', function() {
        // console.log('xhr onload');
        // console.log(this);
        // console.log(this.responseText);
    });
    xhr.addEventListener('error', (e) => {
        console.log('error');
        console.log(req_url);
        console.log(e);
    });

    xhr.send(JSON.stringify(data));
  }

  function generatePatientCredentials(event, view, record) {
    console.log('record-create');
    console.log(event);
    console.log(view);
    console.log(record);
    
    var object_id = 'object_11';
    var custom_email_field = 'field_773';
    var email_field = 'field_134';
    var custom_password_field = 'field_774';

    var name_field = 'field_133';
    var first_name = record[name_field + '_raw'].first;
    var last_name = record[name_field + '_raw'].last;
    var first_name_formatted = first_name.replace(" ", "").toLowerCase();
    var last_name_formatted = last_name.replace(" ", "").toLowerCase();

    var birthday_field = 'field_137';
    var birthday = record[birthday_field];
    var birthday_formatted = moment(birthday).format('DDMMYYYY');

    var custom_email = first_name_formatted + "_" + last_name_formatted + "_" + birthday_formatted + '@unemr.net';
    var custom_password = first_name_formatted + last_name_formatted + birthday_formatted;

    var req_url = "https://api.knack.com/v1/objects/" + object_id + "/records/" + record.id;

    var data = { 
      [custom_email_field]: custom_email,
      [custom_password_field]: custom_password,
      [email_field]: custom_email
    };
    
    console.log('updating patient');
    console.log(req_url);
    console.log(data);

    var xhr = new XMLHttpRequest();

    xhr.open('PUT', req_url, false);
    xhr.setRequestHeader('X-Knack-Application-Id', APP_ID);
    xhr.setRequestHeader('X-Knack-REST-API-KEY', API_KEY);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.addEventListener('load', function() {
      // console.log('xhr onload');
      // console.log(this);
      // console.log(this.responseText);
    });
    xhr.addEventListener('error', (e) => {
        console.log('error');
        console.log(req_url);
        console.log(e);
    });

    xhr.send(JSON.stringify(data));

    // get patient User record
    var patient_user_object_id = 'object_5';
    var patient_user_email_field = 'field_30';
    var req_url2 = "https://api.knack.com/v1/objects/" + patient_user_object_id + "/records";

    console.log('fetching patient user record');
    console.log(req_url2);

    $.ajax({
      type: 'get',
      async: false,
      url: req_url2 + '?filters=[{"field":"' + patient_user_email_field + '", "operator":"is", "value":"' + custom_email + '"}]',
      headers: {
        'X-Knack-Application-Id': APP_ID,
        'X-Knack-REST-API-KEY': API_KEY
      },
      dataType: 'json'
    }).done((results, status) => {
      console.log(results);
      console.log(status);

      if (results.records.length == 1) {
        var user_record = results.records[0];
        var user_record_id = user_record.id;
        var user_password_field_id = 'field_31';
        var req_url3 = 'https://api.knack.com/v1/objects/' + patient_user_object_id + '/records/' + user_record_id;
        var data2 = {
          [user_password_field_id]: custom_password
        };

        console.log('updating password');
        console.log(req_url3);
        console.log(data2);

        // update password
        var xhr2 = new XMLHttpRequest();

        xhr2.open('PUT', req_url3, false);
        xhr2.setRequestHeader('X-Knack-Application-Id', APP_ID);
        xhr2.setRequestHeader('X-Knack-REST-API-KEY', API_KEY);
        xhr2.setRequestHeader('Content-Type', 'application/json');
        xhr2.addEventListener('load', function() {
          // console.log('xhr onload');
          // console.log(this);
          // console.log(this.responseText);
        });
        xhr2.addEventListener('error', (e) => {
          console.log('error');
          console.log(req_url3);
          console.log(e);
        });

        xhr2.send(JSON.stringify(data2));
      }
    }).fail((jqXHR, status, err) => {
      console.log(jqXHR);
      console.log(status);
      console.log(err);
    });
  }

  function updatePatientIsUsingCustomCredentials(record_id) {
    var object_id = 'object_11';
    var is_using_custom_credentials_field = 'field_775';
    var req_url = 'https://api.knack.com/v1/objects/' + object_id + '/records/' + record_id;
    var data = {[is_using_custom_credentials_field]: false};

    var xhr = new XMLHttpRequest();

    console.log('updating is using custom credentials');

    xhr.open('PUT', req_url, false);
    xhr.setRequestHeader('X-Knack-Application-Id', APP_ID);
    xhr.setRequestHeader('X-Knack-REST-API-KEY', API_KEY);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.addEventListener('load', function() {
        // console.log('xhr onload');
        // console.log(this);
        // console.log(this.responseText);
    });
    xhr.addEventListener('error', (e) => {
        console.log('error');
        console.log(req_url);
        console.log(e);
    });

    xhr.send(JSON.stringify(data));
  }

  function loadListeners() {
    console.log('loadListeners');

    // update email and password field of newly added patients with the
    // automatically generated credentials
    // this is via the beta add patient interface
    $(document).on('knack-record-create.view_1184', function(event, view, record) {
        generatePatientCredentials(event, view, record);
    });

    // update email and password field of newly added patients with the
    // automatically generated credentials
    // this is via the old add patient interface
    $(document).on('knack-record-create.view_891', function(event, view, record) {
      generatePatientCredentials(event, view, record);
    });

    // edit account
    // update account stop using custom credentials
    // account settings panel (name, email)
    $(document).on('knack-view-render.view_1101', function(event, view, data) {
        console.log('account edit form');
        console.log(event);
        console.log(view);
        console.log(data);

        var patient_profile = 'profile_11'; // still need to verify profile number
        var is_patient = data.profile_keys_raw.findIndex(a => a.id == patient_profile) !== -1;

        if (is_patient) {
          var email_field = 'field_30';
          var old_email_value = data[email_field + '_raw'].email;
          
          $(document).one('knack-record-update.' + view.key, (event, view, record) => {
            console.log('account edit record update');
            console.log(event);
            console.log(view);
            console.log(record);
            
              var new_email_value = record[email_field + '_raw'].email;
              
              if (new_email_value !== old_email_value) {
                  var object_id = 'object_11';
                  var patient_email_field = 'field_134';
                  var req_url = "https://api.knack.com/v1/objects/" + object_id + "/records";

                  $.ajax({
                      type: 'get',
                      async: false,
                      url: req_url + '?filters=[{"field":"' + patient_email_field + '", "operator":"is", "value":"' + old_email_value + '"}]',
                      headers: {
                          'X-Knack-Application-Id': APP_ID,
                          'X-Knack-REST-API-KEY': API_KEY
                      },
                      dataType: 'json'
                  }).done((results, status) => {
                    console.log('patient found');
                      console.log(results);
                      console.log(status);
                    if (results.records.length > 0) {
                      var patient_record = results.records[0];
                      var patient_record_id = patient_record.id;
                      updatePatientIsUsingCustomCredentials(patient_record_id);
                    }
                  }).fail((jqXHR, status, err) => {
                      console.log(jqXHR);
                      console.log(status);
                      console.log(err);
                  });

                  // var xhr = new XMLHttpRequest();
  
                  // xhr.open('GET', , false);
                  // xhr.setRequestHeader('X-Knack-Application-Id', APP_ID);
                  // xhr.setRequestHeader('X-Knack-REST-API-KEY', API_KEY);
                  // xhr.setRequestHeader('Content-Type', 'application/json');
                  // xhr.addEventListener('load', function() {
                  //     console.log('xhr onload');
                  //     console.log(this);
                  //     console.log(this.responseText);

                  //     // var is_using_custom_credentials_field = 'field_728';
                  
                  //     // var req_url = "https://api.knack.com/v1/objects/" + object_id + "/records/" + record.id;
      
                  //     // var data = { [is_using_custom_credentials_field]: 'No' };
              
                  //     // var xhr = new XMLHttpRequest();
      
                  //     // xhr.open('PUT', req_url, false);
                  //     // xhr.setRequestHeader('X-Knack-Application-Id', APP_ID);
                  //     // xhr.setRequestHeader('X-Knack-REST-API-KEY', API_KEY);
                  //     // xhr.setRequestHeader('Content-Type', 'application/json');
                  //     // xhr.addEventListener('load', function() {
                  //     //     console.log('xhr onload');
                  //     //     console.log(this);
                  //     //     console.log(this.responseText);
                  //     // });
                  //     // xhr.addEventListener('error', (e) => {
                  //     //     console.log('error');
                  //     //     console.log(req_url);
                  //     //     console.log(e);
                  //     // });
      
                  //     // xhr.send(JSON.stringify(data));
                  // });
                  // xhr.addEventListener('error', (e) => {
                  //     console.log('error');
                  //     console.log(req_url);
                  //     console.log(e);
                  // });
  
                  // xhr.send();
              }
          });
        }
    });

    // edit account
    // update account stop using custom credentials
    // change password panel (password)
    $(document).on('knack-view-render.view_1102', function(event, view, data) {
      console.log('account edit form');
      console.log(event);
      console.log(view);
      console.log(data);

      var patient_profile = 'profile_11'; // still need to verify profile number
      var is_patient = data.profile_keys_raw.findIndex(a => a.id == patient_profile) !== -1;

      if (is_patient) {
        $(document).one('knack-record-update.' + view.key, (event, view, record) => {
          console.log('account edit password');
          console.log(event);
          console.log(view);
          console.log(record);

          var email_field = 'field_30';
          var email_value = record[email_field + '_raw'].email;

          var object_id = 'object_11';
          var patient_email_field = 'field_134';
          var req_url = "https://api.knack.com/v1/objects/" + object_id + "/records";

          $.ajax({
            type: 'get',
            async: false,
            url: req_url + '?filters=[{"field":"' + patient_email_field + '", "operator":"is", "value":"' + email_value + '"}]',
            headers: {
                'X-Knack-Application-Id': APP_ID,
                'X-Knack-REST-API-KEY': API_KEY
            },
            dataType: 'json'
          }).done((results, status) => {
              console.log('patient found');
              console.log(results);
              console.log(status);
              if (results.records.length > 0) {
                var patient_record = results.records[0];
                var patient_record_id = patient_record.id;
                updatePatientIsUsingCustomCredentials(patient_record_id);
              }
          }).fail((jqXHR, status, err) => {
              console.log(jqXHR);
              console.log(status);
              console.log(err);
          });
        });
      }
    });

    // iPatient message detail
    $(document).on('knack-view-render.view_1265', function(event, view, data) {
        updateIsUnreadField(data);
    });

    // iProvider message detail
    $(document).on('knack-view-render.view_1283', function(event, view, data) {
        updateIsUnreadField(data);
    });

    // print iPatient credentials
    $(document).on('knack-page-render.scene_745', function(event, scene) {
        window.print();
        window.history.back();
    });

    // remove "Send Message" when logged in user is not a Patient
    // I could not find where this is...
    $(document).on('knack-view-render.view_1298', function(event, view, data) { // to do
        if (!Knack.getUserAttributes().roles.includes('object_11')) {
            $('#' + view.key).find('.kn-button-menu .kn-link-1').remove();
        }
    });

    // @todo(3)
    // save provider id when viewed through referral page
    $(document).on('knack-view-render.view_257', function(event, view, data) { // to do
        STORAGE.setItem('referral_provider', data.id);
    });

    // @todo(3)
    // insert message linked to the message thread created when patient
    // sends message through the referral page
    $(document).on('knack-record-create.view_1299', function(event, view, record) { // to do
        var provider_id = STORAGE.getItem('referral_provider');

        if (provider_id) {
            console.log(record);
            var message_object_id = 'object_76';
            var message_data = {
                'field_725': record.id, // message thread
                'field_726': record.field_714_raw[0].id, // provider
                'field_727': record.field_715_raw[0].id, // patient
                'field_728': record.field_716_raw, // subject
                'field_729': record.field_717_raw, // body
                'field_730': record.field_718, // first created
                'field_731': record.field_718, // last updated
                'field_732': record.field_719_raw[0].id, // sender (user id)
                'field_733': 'Patient', // sender roles
                'field_734': true // is unread
            };

            var req_url = "https://api.knack.com/v1/objects/" + message_object_id + "/records";

            var xhr = new XMLHttpRequest();

            xhr.open('POST', req_url, false);
            xhr.setRequestHeader('X-Knack-Application-Id', APP_ID);
            xhr.setRequestHeader('X-Knack-REST-API-KEY', API_KEY);
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.addEventListener('load', function() {
                // console.log('xhr onload');
                // console.log(this);
                // console.log(this.responseText);
            });
            xhr.addEventListener('error', (e) => {
                console.log('error');
                console.log(req_url);
                console.log(e);
            });

            xhr.send(JSON.stringify(message_data));
        }
    });

    // @todo(4)
    // iprovider teleconference event
    $(document).on('knack-view-render.view_1297', function(event, view, data) {
        console.log(view);
        console.log(data);

        var provider_name = data.field_48_raw.formatted_value;
        var provider_email = data.field_49_raw.email;
        var conference_id = data.field_752_raw;

        var $view = $('#' + view.key);
        var $parent = $view.parent();

        $parent.html("<div id='meeting'></div>");

        const domain = 'meet.jit.si';
        const options = {
            roomName: conference_id,
            width: 1000,
            height: 700,
            parentNode: document.querySelector('#meeting'),
            userInfo: {
                email: provider_email,
                displayName: provider_name
            }
        };
        const api = new JitsiMeetExternalAPI(domain, options);
    });

    // @todo(4)
    // ipatient teleconference event
    $(document).on('knack-view-render.view_1275', function(event, view, data) {
        console.log(view);
        console.log(data);

        var patient_name = data.field_133_raw.formatted_value;
        var patient_email = data.field_134_raw.email;
        var conference_id = data.field_752_raw;

        var $view = $('#' + view.key);
        var $parent = $view.parent();

        $parent.html("<div id='meeting'></div>");

        const domain = 'meet.jit.si';
        const options = {
            roomName: conference_id,
            width: 1000,
            height: 700,
            parentNode: document.querySelector('#meeting'),
            userInfo: {
                email: patient_email,
                displayName: patient_name
            }
        };
        const api = new JitsiMeetExternalAPI(domain, options);
    });

    // reformat add patient encounter form
    $(document).on('knack-view-render.view_1407', function(event, view, data) {
      let $view = $('#' + view.key);
      let insert_after_field = 'field_619';
      let $insert_after_field = $('#kn-input-' + insert_after_field);

      let dropdown_accordion = `
        <div class="unemr-dropdown">
          <div class="unemr-dropdown-item">
            <div class="unemr-dropdown-trigger" data-collapse="true">
              <h3>
                Subjective
              </h3>
            </div>
            <div class="unemr-dropdown-panel">
              <div class="unemr-dropdown-content" id="subjective-panel-content"></div>
            </div>
          </div>
          <div class="unemr-dropdown-item">
            <div class="unemr-dropdown-trigger" data-collapse="true">
              <h3>
                Objective
              </h3>
            </div>
            <div class="unemr-dropdown-panel">
              <div class="unemr-dropdown-content" id="objective-panel-content"></div>
            </div>
          </div>
          <div class="unemr-dropdown-item">
            <div class="unemr-dropdown-trigger" data-collapse="true">
              <h3>
                Assessment
              </h3>
            </div>
            <div class="unemr-dropdown-panel">
              <div class="unemr-dropdown-content" id="assessment-panel-content"></div>
            </div>
          </div>
          <div class="unemr-dropdown-item">
            <div class="unemr-dropdown-trigger" data-collapse="true">
              <h3>
                Plan
              </h3>
            </div>
            <div class="unemr-dropdown-panel">
              <div class="unemr-dropdown-content" id="plan-panel-content"></div>
            </div>
          </div>
        </div>
      `;

      let $dropdown_accordion = $(dropdown_accordion);
      
      let subjective_field_nos = [53, 679];
      // let objective_field_nos = [637, 15, 16, 17, 153, 794, 638, 154, 155, 795, 759, 760, 761, 762, 763, 764, 765, 766, 767, 768, 769, 770, 639, 596];
      let objective_vitals_field_nos = [15, 16, 17, 153, 794];
      let objective_htwt_field_nos = [154, 155, 795];
      let objective_physical_field_nos = [759, 760, 761, 762, 763, 764, 765, 766, 767, 768, 769, 770];
      let objective_confidential_field_nos = [596];
      let assessment_field_nos = [13, 703, 685];
      let plan_field_nos = [79, 704, 14, 805, 771, 772, 103, 618, 781, 266, 678, 306, 680, 156];

      let subjective_fields = subjective_field_nos.map(field_no => $view.find('#kn-input-field_' + field_no).get(0));
      let objective_vitals_fields = objective_vitals_field_nos.map(field_no => $view.find('#kn-input-field_' + field_no).get(0));
      let objective_htwt_fields = objective_htwt_field_nos.map(field_no => $view.find('#kn-input-field_' + field_no).get(0));
      let objective_physical_fields = objective_physical_field_nos.map(field_no => $view.find('#kn-input-field_' + field_no).get(0));
      let objective_confidential_fields = objective_confidential_field_nos.map(field_no => $view.find('#kn-input-field_' + field_no).get(0));
      let assessment_fields = assessment_field_nos.map(field_no => $view.find('#kn-input-field_' + field_no).get(0));
      let plan_fields = plan_field_nos.map(field_no => $view.find('#kn-input-field_' + field_no).get(0));

      let $subjective_fields = $(subjective_fields);
      let $objective_vitals_fields = $(objective_vitals_fields);
      let $objective_htwt_fields = $(objective_htwt_fields);
      let $objective_physical_fields = $(objective_physical_fields);
      let $objective_confidential_fields = $(objective_confidential_fields);
      let $assessment_fields = $(assessment_fields);
      let $plan_fields = $(plan_fields);

      let objective_accordion = `
        <div class="unemr-dropdown">
          <div class="unemr-dropdown-item">
            <div class="unemr-dropdown-trigger" data-collapse="true">
              <h3>
                Vitals
              </h3>
            </div>
            <div class="unemr-dropdown-panel">
              <div class="unemr-dropdown-content" id="objective-vitals-panel-content"></div>
            </div>
          </div>
          <div class="unemr-dropdown-item">
            <div class="unemr-dropdown-trigger" data-collapse="true">
              <h3>
                Height/Weight
              </h3>
            </div>
            <div class="unemr-dropdown-panel">
              <div class="unemr-dropdown-content" id="objective-htwt-panel-content"></div>
            </div>
          </div>
          <div class="unemr-dropdown-item">
            <div class="unemr-dropdown-trigger" data-collapse="true">
              <h3>
                Physical Examination
              </h3>
            </div>
            <div class="unemr-dropdown-panel">
              <div class="unemr-dropdown-content" id="objective-physical-panel-content"></div>
            </div>
          </div>
          <div class="unemr-dropdown-item">
            <div class="unemr-dropdown-trigger" data-collapse="true">
              <h3>
                Confidential Notes
              </h3>
            </div>
            <div class="unemr-dropdown-panel">
              <div class="unemr-dropdown-content" id="objective-confidential-panel-content"></div>
            </div>
          </div>
        </div>
      `;

      let $objective_accordion = $(objective_accordion);

      $objective_accordion.find('#objective-vitals-panel-content').append($objective_vitals_fields);
      $objective_accordion.find('#objective-htwt-panel-content').append($objective_htwt_fields);
      $objective_accordion.find('#objective-physical-panel-content').append($objective_physical_fields);
      $objective_accordion.find('#objective-confidential-panel-content').append($objective_confidential_fields);

      $dropdown_accordion.find('#subjective-panel-content').append($subjective_fields);
      $dropdown_accordion.find('#objective-panel-content').append($objective_accordion);
      $dropdown_accordion.find('#assessment-panel-content').append($assessment_fields);
      $dropdown_accordion.find('#plan-panel-content').append($plan_fields);
      
      $dropdown_accordion.insertAfter($insert_after_field);

      let $dropdown_item_triggers = $dropdown_accordion.find('.unemr-dropdown-trigger');

      $dropdown_item_triggers.on('click', (e) => {
        let $trigger = $(e.currentTarget);
        let $panel = $trigger.parent().children('.unemr-dropdown-panel');
        let isCollapsed = $trigger.attr('data-collapse') === 'true';

        if (isCollapsed) {
          expandPanel($panel);
        } else {
          collapsePanel($panel);
        }
      });
    });

    $(document).on('knack-view-render.view_1194', function(event, view, data) {
      let $view = $('#' + view.key);
      let $patient_menu_group = $('#view_1183').parents('div.view-group');
      let $patient_table_nav = $view.children('.kn-records-nav');
      let $patient_search_form = $patient_table_nav.children('.table-keyword-search');
      let $new_div = $('<div></div>');
      let $new_div_left = $('<div></div>');
      let $new_div_right = $('<div></div>');

      $new_div
        .append($new_div_left)
        .append($new_div_right)
        .insertAfter($patient_search_form)
        .css({
          display: 'flex'
        });
      
      $new_div_left
        .append($patient_search_form)
        .css({
          width: '50%'
        });

      $new_div_right
        .append($patient_menu_group)
        .css({
          width: '50%',
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'flex-start'
        });
    });

    $(document).on('knack-view-render.view_1179', function(event, view, data) {
      let $view = $('#' + view.key);
      let $view_parent_group = $view.parents('.view-group');
      let $profile_menu_column = $('#view_1180').parents('.view-column');

      $view_parent_group
        .append($profile_menu_column)
        .css({
          display: 'flex'
        })
        .children()
        .css({
          width: '50%'
        });
      
      $profile_menu_column
        .css({
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'flex-start',
          paddingRight: '24px'
        });

      $view.find('tr.field_29 td.kn-value span')
        .text('Welcome, ' + Knack.getUserAttributes().name);
    });

    let beta_scenes = [
      697, 698, 699, 700, 701, 702, 703, 704, 705, 706, 707, 708, 709, 710, 711,
      712, 714, 715, 716, 717, 718, 719, 720, 721, 722, 723, 724, 725, 726, 727,
      728, 745, 746, 747, 813, 729, 731, 749, 751, 750, 748, 730, 752, 753, 755,
      754
    ];

    beta_scenes.forEach(scene_no => {
      $(document).on('knack-page-render.scene_' + scene_no, function(event, scene) {
        console.log(scene);
        $('#kn-scene_' + scene_no).css({
          fontFamily: "'Nunito Sans', 'Helvetica Neue', HelveticaNeue, Helvetica, Arial, 'Lucida Grande', sans-serif"
        });
      });
    });

    $(document).on('knack-view-render.view_1195', function(event, view, data) {
      let $view = $('#' + view.key);
      let tab_panel = `
        <div class="unemr-tab">
          <div class="unemr-tabs">
            <div class="unemr-tab-trigger unemr-tab-trigger-active" data-trigger="contacts-panel">
              <h3>
                Emergency Contacts
              </h3>
            </div>
            <div class="unemr-tab-trigger" data-trigger="notes-panel">
              <h3>
                Patient Notes
              </h3>
            </div>
            <div class="unemr-tab-trigger" data-trigger="credentials-panel">
              <h3>
                Patient Credentials
              </h3>
            </div>
            <div class="unemr-tab-trigger" data-trigger="telehealth-panel">
              <h3>
                Telehealth Info
              </h3>
            </div>
          </div>
          <div class="unemr-tab-panels">
            <div class="unemr-tab-panel unemr-tab-panel-active" id="contacts-panel">
              <div class="unemr-tab-content" id="contacts-panel-content"></div>
            </div>
            <div class="unemr-tab-panel" id="notes-panel">
              <div class="unemr-tab-content" id="notes-panel-content"></div>
            </div>
            <div class="unemr-tab-panel" id="credentials-panel">
              <div class="unemr-tab-content" id="credentials-panel-content">
                <div class="unemr-tab-content-header">
                  Give these credentials to the patient and have them reset their own password once they login.
                </div>
              </div>
            </div>
            <div class="unemr-tab-panel" id="telehealth-panel">
              <div class="unemr-tab-content" id="telehealth-panel-content"></div>
            </div>
          </div>
        </div>
      `;

      let $tab_panel = $(tab_panel);
      let $patient_details_wrapper = $('<div></div>');
      let $patient_details_table = $view.children('.kn-details-column');

      $patient_details_wrapper
        .insertAfter($view.children('.view-header'));

      $patient_details_wrapper
        .append($patient_details_table)
        .append($tab_panel)
        .css({
          display: 'flex'
        });

      let contacts_field_nos = [140, 143];
      let notes_field_nos = [681, 675, 676, 677, 788, 789, 790, 240, 623];
      let credentials_field_nos = [134, 774];
      let telehealth_field_nos = [776, 777];

      let contacts_fields = contacts_field_nos.map(field_no => $view.find('tr.field_' + field_no).get(0));
      let notes_fields = notes_field_nos.map(field_no => $view.find('tr.field_' + field_no).get(0));
      let credentials_fields = credentials_field_nos.map(field_no => $view.find('tr.field_' + field_no).get(0));
      let telehealth_fields = telehealth_field_nos.map(field_no => $view.find('tr.field_' + field_no).get(0));

      let $contacts_fields = $(contacts_fields);
      let $notes_fields = $(notes_fields);
      let $credentials_fields = $(credentials_fields);
      let $telehealth_fields = $(telehealth_fields);

      $contacts_fields.find('th, td').css({width: '50%'});
      $notes_fields.find('th, td').css({width: '50%'});
      $credentials_fields.find('th, td').css({width: '50%'});
      $telehealth_fields.find('th, td').css({width: '50%'});

      let tab_content_table = `
        <div class="kn-details">
          <table>
            <tbody></tbody>
          </table>
        </div>
      `;

      let $contacts_table = $(tab_content_table);
      let $notes_table = $(tab_content_table);
      let $credentials_table = $(tab_content_table);
      let $telehealth_table = $(tab_content_table);

      $contacts_table.find('table tbody').append($contacts_fields);
      $notes_table.find('table tbody').append($notes_fields);
      $credentials_table.find('table tbody').append($credentials_fields);
      $telehealth_table.find('table tbody').append($telehealth_fields);

      $tab_panel.find('#contacts-panel-content').append($contacts_table);
      $tab_panel.find('#notes-panel-content').append($notes_table);
      $tab_panel.find('#credentials-panel-content').append($credentials_table);
      $tab_panel.find('#telehealth-panel-content').append($telehealth_table);

      let $details_link = $patient_details_table.find('tr.kn-details-link');

      let contacts_links = [0].map(i => $details_link[i]);
      $contacts_table.append(contacts_links);

      let notes_links = [1].map(i => $details_link[i]);
      $notes_table.append(notes_links);

      let credentials_links = [2,3].map(i => $details_link[i]);
      $credentials_table.append(credentials_links);
    });

    $(document).on('knack-view-render.view_1184', function(event, view, data) {
      let $view = $('#' + view.key);
      let tab_panel = `
        <div class="unemr-tab">
          <div class="unemr-tabs">
            <div class="unemr-tab-trigger unemr-tab-trigger-active" data-trigger="ap-meta-panel">
              <h3>
                Patient Metadata
              </h3>
            </div>
            <div class="unemr-tab-trigger" data-trigger="ap-notes-panel">
              <h3>
                Patient Notes
              </h3>
            </div>
            <div class="unemr-tab-trigger" data-trigger="ap-telehealth-panel">
              <h3>
                Telehealth
              </h3>
            </div>
            <div class="unemr-tab-trigger" data-trigger="ap-history-panel">
              <h3>
                Patient, Social, and Family History
              </h3>
            </div>
            <div class="unemr-tab-trigger" data-trigger="ap-emergency-panel">
              <h3>
                Emergency Contacts
              </h3>
            </div>
            <div class="unemr-tab-trigger" data-trigger="ap-consent-panel">
              <h3>
                Consent
              </h3>
            </div>
          </div>
          <div class="unemr-tab-panels">
            <div class="unemr-tab-panel unemr-tab-panel-active" id="ap-meta-panel">
              <div class="unemr-tab-content" id="ap-meta-panel-content"></div>
            </div>
            <div class="unemr-tab-panel" id="ap-notes-panel">
              <div class="unemr-tab-content" id="ap-notes-panel-content"></div>
            </div>
            <div class="unemr-tab-panel" id="ap-telehealth-panel">
              <div class="unemr-tab-content" id="ap-telehealth-panel-content"></div>
            </div>
            <div class="unemr-tab-panel" id="ap-history-panel">
              <div class="unemr-tab-content" id="ap-history-panel-content"></div>
            </div>
            <div class="unemr-tab-panel" id="ap-emergency-panel">
              <div class="unemr-tab-content" id="ap-emergency-panel-content"></div>
            </div>
            <div class="unemr-tab-panel" id="ap-consent-panel">
              <div class="unemr-tab-content" id="ap-consent-panel-content"></div>
            </div>
          </div>
        </div>
      `;

      let $tab_panel = $(tab_panel);
      let $form = $view.find('form');

      let meta_field_nos = [133, 137, 138, 139, 136, 623, 686];
      let notes_field_nos = [681, 675, 676, 677, 240];
      let telehealth_field_nos = [776, 777];
      let history_field_nos = [788, 789, 790, 792];
      let emergency_field_nos = [140, 141, 143, 144];
      let consent_field_nos = [633, 634];

      let meta_fields = meta_field_nos.map(field_no => $view.find('#kn-input-field_' + field_no).get(0));
      let notes_fields = notes_field_nos.map(field_no => $view.find('#kn-input-field_' + field_no).get(0));
      let telehealth_fields = telehealth_field_nos.map(field_no => $view.find('#kn-input-field_' + field_no).get(0));
      let history_fields = history_field_nos.map(field_no => $view.find('#kn-input-field_' + field_no).get(0));
      let emergency_fields = emergency_field_nos.map(field_no => $view.find('#kn-input-field_' + field_no).get(0));
      let consent_fields = consent_field_nos.map(field_no => $view.find('#kn-input-field_' + field_no).get(0));

      let $meta_fields = $(meta_fields);
      let $notes_fields = $(notes_fields);
      let $telehealth_fields = $(telehealth_fields);
      let $history_fields = $(history_fields);
      let $emergency_fields = $(emergency_fields);
      let $consent_fields = $(consent_fields);

      $tab_panel.find('#ap-meta-panel').append($meta_fields);
      $tab_panel.find('#ap-notes-panel').append($notes_fields);
      $tab_panel.find('#ap-telehealth-panel').append($telehealth_fields);
      $tab_panel.find('#ap-history-panel').append($history_fields);
      $tab_panel.find('#ap-emergency-panel').append($emergency_fields);
      $tab_panel.find('#ap-consent-panel').append($consent_fields);

      $form.prepend($tab_panel);
    });

    $(document).on('click', '.unemr-tab-trigger', function(e) {
      let $trigger = $(this);
      let $tab = $trigger.parents('.unemr-tab').first();

      if (!$trigger.hasClass('unemr-tab-trigger-active')) {
        let panel = $trigger.attr('data-trigger');
        let $panel = $tab.find('#' + panel);

        $tab.find('.unemr-tab-trigger-active')
          .removeClass('unemr-tab-trigger-active');

        $tab.find('.unemr-tab-panel-active')
          .removeClass('unemr-tab-panel-active');

        $trigger.addClass('unemr-tab-trigger-active');
        $panel.addClass('unemr-tab-panel-active');
      }
    });
  }

  // This is the important part!
  // based on https://css-tricks.com/using-css-transitions-auto-dimensions/
  function collapsePanel($panel) {
    let panel = $panel.get(0);
    let panel_height = panel.scrollHeight;
    let panel_transition = panel.style.transition;

    // temporarily disable all css transitions
    $panel.css('transition', '');

    // on the next frame (as soon as the previous style change has taken effect),
    // explicitly set the element's height to its current pixel height, so we 
    // aren't transitioning out of 'auto'
    requestAnimationFrame(function() {
      $panel.css({
        height: panel_height + 'px',
        transition: panel_transition
      });

      // on the next frame (as soon as the previous style change has taken effect),
      // have the element transition to height: 0
      requestAnimationFrame(function() {
        $panel.css({
          height: '0px'
        });
      });
    });

    $panel.parent().children('.unemr-dropdown-trigger').attr('data-collapse', 'true');
  }

  function expandPanel($panel) {
    let panel = $panel.get(0);
    let panel_height = panel.scrollHeight;

    $panel.css('height', panel_height + 'px');

    // when the next css transition finishes (which should be the one we just triggered)
    $panel.one('transitionend', function(e) {
      $panel.css('height', 'auto');
    });

    $panel.parent().children('.unemr-dropdown-trigger').attr('data-collapse', 'false');
  }
}


// const UnEMRTab = (tab_data) => {
  
// };

// class UnEMRTab {
//   constructor(tab_data) {
//     let tab_id = tab_data.id;
//     let tab = `
//       <div class="unemr-tab">
//         <div class="unemr-tabs"></div>
//         <div class="unemr-tab-panels"></div>
//       </div>
//     `;

//     let tab_trigger_template = `
//       <div class="unemr-tab-trigger" data-trigger=""><h3></h3></div>
//     `;

//     let tab_panel_template = `
//       <div class="unemr-tab-panel" id="">
//         <div class="unemr-tab-content" id=""></div>
//       </div>
//     `;

//     /*
//       tab_data = {
//         id: <tab_id>,
//         active: 0,
//         tabs: [
//           {
//             panel: <panel_id>,
//             panel_content: <panel_content_id>,
//             header: <content_header>
//             footer: <content_footer>
//           }, ...
//         ]
//       }
//     */
//   }
// }