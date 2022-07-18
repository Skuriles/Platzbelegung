<?php
/**
 * Plugin Name: SVD Sportheim API
 */
/**
 * Grab latest post title by an author!
 *
 * @param array $data Options for the function.
 * @return string|null Post title for the latest, * or null if none.
 */

register_activation_hook(__FILE__, 'init_svd_api_database');
// register_activation_hook(__FILE__, 'test_svdapi_database');

add_action('rest_api_init', function () {

    register_rest_route('svd_sportheim/v1', '/getAll', array(
        'methods' => 'POST',
        'callback' => 'get_all_svdapi_data',
    ));

    register_rest_route('svd_sportheim/v1', '/saveGame', array(
        'methods' => 'POST',
        'callback' => 'save_svdapi_game',
    ));

    register_rest_route('svd_sportheim/v1', '/addGame', array(
        'methods' => 'POST',
        'callback' => 'insert_svdapi_game',
    ));

    register_rest_route('svd_sportheim/v1', '/deleteGame/(?P<id>\d+)', array(
        'methods' => 'POST',
        'callback' => 'remove_svdapi_game',
    ));

    register_rest_route('svd_sportheim/v1', '/uploadCsv', array(
        'methods' => 'POST',
        'callback' => 'import_svdapi_game',
    ));

    register_rest_route('svd_sportheim/v1', '/userInfo/(?P<id>\d+)', array(
        'methods' => 'POST',
        'callback' => 'get_user_roles_by_user_id',
    ));
});

define("svdTable", 'svd_sportheim');

function get_user_roles_by_user_id($data)
{
    $user = get_userdata($data["id"]);
    return empty($user) ? array() : $user->roles;
}

function init_svd_api_database()
{
    global $wpdb;
    $table_name = $wpdb->prefix . svdTable;

    $charset_collate = $wpdb->get_charset_collate();

    $sql = "CREATE TABLE $table_name (
      id mediumint(9) NOT NULL AUTO_INCREMENT,
      datum datetime NOT NULL,
      mannschaft text NOT NULL,
      heim text NOT NULL,
      gast text NOT NULL,
      person text,
      PRIMARY KEY  (id)
    ) $charset_collate;";

    require_once ABSPATH . 'wp-admin/includes/upgrade.php';
    dbDelta($sql);
}

function get_all_svdapi_data()
{
    global $wpdb;
    $table = $wpdb->prefix . svdTable;    
    $results = $wpdb->get_results("SELECT * FROM $table");        
    return $results;    
}

function save_svdapi_game(WP_REST_Request $request)
{
    global $wpdb;

    $table_name = $wpdb->prefix . svdTable;
    $result = $request->get_json_params();
    $ele = $result["element"];
    $date = sanitize_text_field($ele["datum"]);
    $person = sanitize_text_field($ele["person"]);
    $result = $wpdb->update(
        $table_name,
        array(
            'datum' => $date,
            'person' => $person,
        ),
        array('id' => $ele["id"]));
    return $result;
}

function insert_svdapi_game(WP_REST_Request $request)
{
    global $wpdb;

    $table_name = $wpdb->prefix . svdTable;
    $result = $request->get_json_params();
    $ele = $result["element"];
    $date = sanitize_text_field($ele["datum"]);
    $mannschaft = sanitize_text_field($ele["mannschaft"]);
    $heim = sanitize_text_field($ele["heim"]);
    $gast = sanitize_text_field($ele["gast"]);
    $person = sanitize_text_field($ele["person"]);
    $result = $wpdb->insert(
        $table_name,
        array(
            'datum' => $date,
            'mannschaft' => $mannschaft,
            'heim' => $heim,
            'gast' => $gast,
            'person' => $person,
        )
    );
    return $result;
}

function remove_svdapi_game($data)
{
    global $wpdb;
    $table_name = $wpdb->prefix . svdTable;
    $result = $wpdb->delete(
        $table_name,
        array(
            'id' => $data['id'],
        )
    );
    return $result;
}

function import_svdapi_game(WP_REST_Request $request)
{

    $permittedExtension = 'csv';
    $permittedTypes = ['text/csv', 'text/plain', "application/octet-stream"];

    $files = $request->get_file_params();
    $headers = $request->get_headers();

    if (!empty($files) && !empty($files['file'])) {
        $file = $files['file'];
    }

    try {
        // smoke/sanity check
        if (!$file) {
            throw new PluginException('Error');
        }
        // confirm file uploaded via POST
        if (!is_uploaded_file($file['tmp_name'])) {
            throw new PluginException('File upload check failed ');
        }
        // confirm no file errors
        if (!$file['error'] === UPLOAD_ERR_OK) {
            throw new PluginException('Upload error: ' . $file['error']);
        }
        // confirm extension meets requirements
        $ext = pathinfo($file['name'], PATHINFO_EXTENSION);
        if ($ext !== $permittedExtension) {
            throw new PluginException('Invalid extension. ');
        }
        // check type
        $mimeType = mime_content_type($file['tmp_name']);
        if (!in_array($file['type'], $permittedTypes)
            || !in_array($mimeType, $permittedTypes)) {
            throw new PluginException('Invalid mime type');
        }
    } catch (PluginException $pe) {
        return $pe->restApiErrorResponse('...');
    }

    // we've passed our checks, now read and process the file
    $handle = fopen($file['tmp_name'], 'r');
    $headerFlag = true;
    global $wpdb;

    $table_name = $wpdb->prefix . svdTable;
    while (($data = fgetcsv($handle, 1000, ',')) !== false) { // next arg is field delim e.g. "'"
        // skip csv's header row / first iteration of loop
        if ($headerFlag) {
            $headerFlag = false;
            continue;
        }
        // process rows in csv body
        if ($data[0]) {
            $date = sanitize_text_field($data[0]);
            $mannschaft = sanitize_text_field($data[1]);
            $heim = sanitize_text_field($data[2]);
            $gast = sanitize_text_field($data[3]);
            $result = $wpdb->insert(
                $table_name,
                array(
                    'datum' => $date,
                    'mannschaft' => $mannschaft,
                    'heim' => $heim,
                    'gast' => $gast,
                )
            );
            if (!$result) {
                fclose($handle);
                return rest_ensure_response(['success' => false]);
            }
        }

    }
    fclose($handle);
    // return any necessary data in the response here
    return rest_ensure_response(['success' => true]);
}
