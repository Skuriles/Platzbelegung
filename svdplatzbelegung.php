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

    register_rest_route('svd_platzbelegung/v1', '/saveGame', array(
        'methods' => 'POST',
        'callback' => 'save_svdapi_event',
    ));

    register_rest_route('svd_platzbelegung/v1', '/addGame', array(
        'methods' => 'POST',
        'callback' => 'insert_svdapi_event',
    ));

    register_rest_route('svd_platzbelegung/v1', '/deleteGame/(?P<id>\d+)', array(
        'methods' => 'POST',
        'callback' => 'remove_svdapi_event',
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
    $result = $wpdb->update(
        $table_name,
        array(
            'title' => $title,
            'startdateStr' => $startdate,
            'enddateStr' => $enddate,
            'person' => $person,
            'details' => $details,
            'allDayPhp' => $allday,
        ),
        array('id' => $ele["id"]));
    return $result;
}

function insert_svdapi_event(WP_REST_Request $request)
{
    global $wpdb;

    $table_name = $wpdb->prefix . svdPlatzbelegungTable;
    $result = $request->get_json_params();
    $ele = $result["element"];
    $startdate = sanitize_text_field($ele["startdateStr"]);
    $enddate = sanitize_text_field($ele["enddateStr"]);
    $title = sanitize_text_field($ele["title"]);
    $person = sanitize_text_field($ele["person"]);
    $details = sanitize_text_field($ele["details"]);
    $allday = $ele["allDayPhp"];
    $result = $wpdb->insert(
        $table_name,
        array(
            'title' => $title,
            'startdateStr' => $startdate,
            'enddateStr' => $enddate,
            'person' => $person,
            'details' => $details,
            'allDayPhp' => $allday,
        ),
    );
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
