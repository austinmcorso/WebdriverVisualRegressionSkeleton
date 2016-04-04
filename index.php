<?php
/**
 * @file
 * Provides ordered links to visual regression test results.
 */

$files = glob_recursive('results/**/*.png');
usort($files, function($a, $b) {
  return filemtime($a) < filemtime($b);
});
$envs = json_decode(file_get_contents('environments.json'), true);

// Error message if no tests or envs are found.
if (empty($files) || empty($envs)) {
  print '<h1>Visual Regression Test Results</h1>';
  print '<h4>No tests found within ' . getcwd() . '</h4>';
  return;
}

print_page(sort_files($files, $envs));

/**
 * Organize files by environment and type.
 */
function sort_files($files, $envs) {
  $env_files = [];
  foreach ($envs as $i => $key) {
    $env_files[$i] = [
      'baselines' => [],
      'failures' => [],
      'diffs' => []
    ];
  }

  foreach ($files as $i => $file) {
    $urlarray = explode("/", $file);
    $env = $urlarray[count($urlarray)-3];
    unset($files[$i]);

    if (strpos($file, '.regression') !== FALSE) {
      $env_files[$env]['failures'][] = $file;
    }
    elseif (strpos($file, '.diff') !== FALSE) {
      $env_files[$env]['diffs'][] = $file;
    }
    elseif (strpos($file, '.baseline') !== FALSE) {
      $env_files[$env]['baselines'][] = $file;
    }
  }

  return $env_files;
}

/**
 * Print page.
 */
function print_page($files) {
  print "<link rel='stylesheet' type='text/css' href='./style.css'>";
  print "<script src='index.js'></script>";
  print "<div class='header'>";
  print '<h1>Visual Regression Test Results</h1>';
  print "</div>";
  print "<div id='menu'>";
  printFilters($files);
  print "<div id='file_list'>";
  foreach (array_keys($files) as $env) {
    printLinks($files[$env], $env);
  }
  print "</div>";
  print "</div>";
  print "<div id='image_diff_wrapper'>";
  print "<img id='image_diff'>";
  print "</div>";
}

/**
 * Recursive search for pattern.
 */
function glob_recursive($pattern, $flags = 0) {
    $files = glob($pattern, $flags);
    foreach (glob(dirname($pattern).'/*', GLOB_ONLYDIR|GLOB_NOSORT) as $dir) {
        $files = array_merge($files, glob_recursive($dir.'/'.basename($pattern), $flags));
    }
    return $files;
}

/**
 * Clean up URL's.
 */
function friendlyURL($inputString){
  $url = strtolower($inputString);
  $url = substr($url, 0, strrpos($url, "."));  // Remove file extension.
  $patterns = $replacements = array();
  $patterns[0] = '/(&amp;|&)/i'; // Replace ampersands.
  $replacements[0] = '-and-';
  $patterns[1] = '/[^a-zA-Z01-9\/\.\-\_]/i'; // Replace non-alphanumeric except slashes and periods.
  $replacements[1] = '-';
  $patterns[2] = '/^\./i'; // Remove dot from beginning of URL if it exists.
  $replacements[2] = '';
  $url = preg_replace($patterns, $replacements, $url);
  return $url;
}

/**
 * Format links and print.
 */
function printLinks($files, $env) {
  if (empty($files['baselines'])) return;

  $test_logs = json_decode(file_get_contents('./results/' . $env . '/test-results.json'), true);

  if (empty($files['failures'])) {
    if (empty($test_logs)) {
      $msg = "No Comparissons Run";
      $class = 'title_info';
    } else {
      $msg = "All Tests Passing!";
      $class = 'title_passing';
    }

    print "<h4 id='title_" . $env . "' class='" . $class . "'><span class='title_env'>" . $env . ":</span> " . $msg . "</h4>";
  }

  foreach (array_keys($files) as $file_type) {
    if (empty($files[$file_type])) continue;

    print "<h4 id='title_" . $env . "' class=title_" . $file_type . "'><span class='title_env'>" . $env . ":</span> " . $file_type . "</h4>";
    print "<table id='" . $env . "_" . $file_type . "'>";
    foreach ($files[$file_type] as $file) {
      $fileData = stat($file);
      $fileComponents = explode("/", ltrim($file, "./")); // Trim leading dots and slashes. Split file path into components.
      $fileComponentsCount = count($fileComponents);
      $fileName = $fileComponents[$fileComponentsCount - 1];
      print '<tr class="result" data-href="#' . friendlyURL($file) . '">';
      print '<td>' . $fileName . '</td>';
      print '<td>' . date('Y-m-d H:i:s', $fileData['mtime']) . '</td>';
      print '</tr>';
    }
    print '</table>';
  }
}

/**
 * Format filters and print.
 */
function printFilters($files) {
  $filters = array();

  // Only add filter to list if sceenshot exists for it.
  foreach ($files as $env => $env_files) {
    $count = count($env_files, 1) - 3;
    if ($count) {
      $filters[] = "<li><a class='env' id='" . $env . "'>" . ucfirst($env) . "</a></li>";
    }
  }

  // Only display list of filters if more than one filter is available.
  if (count($filters) > 1) {
    print "<div id='env_menu'><ul>";
    foreach ($filters as $filter) {
      print $filter;
    }
    print "</ul></div>";
  }
}

