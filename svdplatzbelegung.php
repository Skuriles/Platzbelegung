<?php

/**
 * Plugin Name: SVD Platzbelegung API
 */
/**
 * Grab latest post title by an author!
 *
 * @param array $data Options for the function.
 * @return string|null Post title for the latest, * or null if none.
 */

register_activation_hook(__FILE__, 'init_svd_platzbelegung_api_database');
// register_activation_hook(__FILE__, 'test_svdapi_database');

add_action('rest_api_init', function () {

    register_rest_route('svd_platzbelegung/v1', '/getAll', array(
        'methods' => 'POST',
        'callback' => 'get_all_platzbelegung_data',
    ));

    register_rest_route('svd_platzbelegung/v1', '/getAllGames', array(
        'methods' => 'POST',
        'callback' => 'get_all_svdapi_games',
    ));

    register_rest_route('svd_platzbelegung/v1', '/saveEvent', array(
        'methods' => 'POST',
        'callback' => 'save_svdapi_event',
    ));

    register_rest_route('svd_platzbelegung/v1', '/addEvent', array(
        'methods' => 'POST',
        'callback' => 'insert_svdapi_event',
    ));

    register_rest_route('svd_platzbelegung/v1', '/deleteEvent/(?P<id>\d+)', array(
        'methods' => 'POST',
        'callback' => 'remove_svdapi_event',
    ));

    register_rest_route('svd_platzbelegung/v1', '/deleteEventAll/(?P<id>\d+)', array(
        'methods' => 'POST',
        'callback' => 'remove_svdapi_event_all',
    ));

    // register_rest_route('svd_platzbelegung/v1', '/uploadCsv', array(
    //     'methods' => 'POST',
    //     'callback' => 'import_svdapi_game',
    // ));

    register_rest_route('svd_platzbelegung/v1', '/userInfo/(?P<id>\d+)', array(
        'methods' => 'POST',
        'callback' => 'get_user_roles_by_user_id_platz',
    ));
});

define("svdPlatzbelegungTable", 'svd_platzbelegung');

function get_user_roles_by_user_id_platz($data)
{
    $user = get_userdata($data["id"]);
    return empty($user) ? array() : $user->roles;
}

function init_svd_platzbelegung_api_database()
{
    global $wpdb;
    $table_name = $wpdb->prefix . svdPlatzbelegungTable;

    $charset_collate = $wpdb->get_charset_collate();

    $sql = "CREATE TABLE $table_name (
      id mediumint(9) NOT NULL AUTO_INCREMENT,
      title text NOT NULL,
      startdateStr datetime NOT NULL,
      enddateStr datetime NOT NULL,
      mannschaft text NOT NULL,
      details text NOT NULL,
      allDayPhp boolean NOT NULL default 0,
      person text,
      ortePhp text,
      repeatsPhp boolean NOT NULL default 0,
      repeatsEnd dateTime,
      baseId int,
      customDaysPhp text,
      PRIMARY KEY  (id)
    ) $charset_collate;";

    require_once ABSPATH . 'wp-admin/includes/upgrade.php';
    dbDelta($sql);
}

function get_all_platzbelegung_data()
{
    global $wpdb;
    $table = $wpdb->prefix . svdPlatzbelegungTable;
    $results = $wpdb->get_results("SELECT * FROM $table");
    return $results;
}

function get_all_svdapi_games()
{
    global $wpdb;
    $table = $wpdb->prefix . svdTable;
    $results = $wpdb->get_results("SELECT * FROM $table");
    return $results;
}

function save_svdapi_event(WP_REST_Request $request)
{
    global $wpdb;

    $table_name = $wpdb->prefix . svdPlatzbelegungTable;
    $result = $request->get_json_params();
    $ele = $result["element"];
    $startdate = sanitize_text_field($ele["startdate"]);
    $enddate = sanitize_text_field($ele["enddate"]);
    $title = sanitize_text_field($ele["title"]);
    $person = sanitize_text_field($ele["person"]);
    $details = sanitize_text_field($ele["details"]);
    $allday = $ele["allDayPhp"];
    $orte = sanitize_text_field($ele["ortePhp"]);
    $repeats = sanitize_text_field($ele["repeatsPhp"]);
    $repeatsEnd = sanitize_text_field($ele["repeatsEnd"]);
    $baseId = sanitize_text_field($ele["baseId"]);
    $customDaysPhp = sanitize_text_field($ele["customDaysPhp"]);
    $result = $wpdb->update(
        $table_name,
        array(
            'title' => $title,
            'startdateStr' => $startdate,
            'enddateStr' => $enddate,
            'person' => $person,
            'details' => $details,
            'allDayPhp' => $allday,
            'ortePhp' => $orte,
            'repeatsPhp' => $repeats,
            'repeatsEnd' => $repeatsEnd,
            'baseId' => $baseId,
            'customDaysPhp' => $customDaysPhp,
        ),
        array('id' => $ele["id"])
    );
    return $result;
}

function insert_svdapi_event(WP_REST_Request $request)
{
    global $wpdb;
    $wpdb->show_errors();

    $table_name = $wpdb->prefix . svdPlatzbelegungTable;
    $result = $request->get_json_params();
    $ele = $result["element"];
    $startdate = sanitize_text_field($ele["startdateStr"]);
    $enddate = sanitize_text_field($ele["enddateStr"]);
    $title = sanitize_text_field($ele["title"]);
    $person = sanitize_text_field($ele["person"]);
    $details = sanitize_text_field($ele["details"]);
    $allday = $ele["allDayPhp"];
    $orte = sanitize_text_field($ele["ortePhp"]);
    $repeats = sanitize_text_field($ele["repeatsPhp"]);
    $repeatsEnd = sanitize_text_field($ele["repeatsEnd"]);
    $customDaysPhp = sanitize_text_field($ele["customDaysPhp"]);
    $result = $wpdb->insert(
        $table_name,
        array(
            'title' => $title,
            'startdateStr' => $startdate,
            'enddateStr' => $enddate,
            'person' => $person,
            'details' => $details,
            'allDayPhp' => $allday,
            'ortePhp' => $orte,
            'repeatsPhp' => $repeats,
            'repeatsEnd' => $repeatsEnd,
            'customDaysPhp' => $customDaysPhp,
        )
    );
    $lastid = $wpdb->insert_id;
    if ($repeats == "1") {
        $weeks = datediffInWeeks($startdate, $repeatsEnd);
        $start = new DateTime($startdate);
        $day = $start->format('N');
        $customDays = $ele["customDays"];
        $repeatDays = getWeekDayOffsets($day, $customDays);
        // $test = array();
        for ($i = 1; $i <= $weeks; $i++) {
            for ($j = 0; $j < count($repeatDays); $j++) {
                $start = new DateTime($startdate);
                $end = new DateTime($enddate);
                $offset = ($i * 7) + $repeatDays[$j];
                $newStartDate = $start->add(new DateInterval('P' . $offset . 'D'));
                $newEndDate = $end->add(new DateInterval('P' . $offset . 'D'));
                // array_push($test, array(
                //     'title' => $title,
                //     'startdateStr' => $newStartDate->format('Y-m-d H:i:s'),
                //     'enddateStr' => $newEndDate->format('Y-m-d H:i:s'),
                //     'person' => $person,
                //     'details' => $details,
                //     'allDayPhp' => $allday,
                //     'ortePhp' => $orte,
                //     'repeatsPhp' => "0",
                //     'baseId' => $lastid,
                // ));
                if ($newStartDate < new DateTime($repeatsEnd) && $newStartDate > new DateTime($startdate)) {
                    $wpdb->insert(
                        $table_name,
                        array(
                            'title' => $title,
                            'startdateStr' => $newStartDate->format('Y-m-d H:i:s'),
                            'enddateStr' => $newEndDate->format('Y-m-d H:i:s'),
                            'person' => $person,
                            'details' => $details,
                            'allDayPhp' => $allday,
                            'ortePhp' => $orte,
                            'repeatsPhp' => "0",
                            'baseId' => $lastid,
                            'repeatsEnd' => $repeatsEnd,
                            'customDaysPhp' => $customDaysPhp,
                        )
                    );
                }
            }
        }
        // return $wpdb->print_error();

    }
    // return $test;
    return $result;
}

function datediffInWeeks($date1, $date2)
{
    $first = new DateTime($date1);
    $second = new DateTime($date2);
    return floor($first->diff($second)->days / 7);
}

function getWeekDayOffsets($day, $customDays)
{
    $result = array();

    $dayInt = intval($day);
    foreach ($customDays as $element) {
        switch ($element) {
            case 'Sonntag':
                array_push($result, 0 - $dayInt);
                break;
            case 'Montag':
                array_push($result, 1 - $dayInt);
                break;
            case 'Dienstag':
                array_push($result, 2 - $dayInt);
                break;
            case 'Mittwoch':
                array_push($result, 3 - $dayInt);
                break;
            case 'Donnerstag':
                array_push($result, 4 - $dayInt);
                break;
            case 'Freitag':
                array_push($result, 5 - $dayInt);
                break;
            case 'Samstag':
                array_push($result, 6 - $dayInt);
                break;

            default:
                break;
        }
    }
    sort($result);
    return $result;
}

function remove_svdapi_event($data)
{
    global $wpdb;
    $table_name = $wpdb->prefix . svdPlatzbelegungTable;
    $result = $wpdb->delete(
        $table_name,
        array(
            'id' => $data['id'],
        )
    );
    return $result;
}

function remove_svdapi_event_all($data)
{
    global $wpdb;
    $table_name = $wpdb->prefix . svdPlatzbelegungTable;
    $result = $wpdb->delete(
        $table_name,
        array(
            'id' => $data['id'],
        )
    );
    if ($result) {
        $result = $wpdb->delete(
            $table_name,
            array(
                'baseId' => $data['id'],
            )
        );
    }
    return $result;
}
