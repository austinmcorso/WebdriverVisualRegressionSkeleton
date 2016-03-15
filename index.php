<?php
/**
 * @file
 * Provides ordered links to visular regression test results.
 */

// Load all the .png files.
$files = array_merge(glob_recursive('results/**/*.png'));

// Error message if no tests are found.
if (empty($files)) {
  print '<h1>Visual Regression Test Results</h1>';
  print '<h4>No tests found within ' . getcwd() . '</h4>';
  return;
}

// Sort the files by modification/creation date.
usort($files, function($a, $b) {
  return filemtime($a) < filemtime($b);
});

// Define environments and file count for each.
$envs = array(
  'local' => 0,
  'dev' => 0,
  'stage' => 0,
  'prod' => 0
);

// Organize the files by fail/pass/baseline.
$files_fail = array();
$files_diff = array();
foreach ($files as $i => $file) {
  // Determine test env for file and increment env count.
  $urlarray = explode("/", $file);
  $env = $urlarray[count($urlarray)-3];
  $envs[$env]++;
  if (strpos($file, '.regression') !== FALSE) {
    unset($files[$i]);
    $files_fail[] = $file;
  }
  elseif (strpos($file, '.diff') !== FALSE) {
    unset($files[$i]);
    $files_diff[] = $file;
  }
  elseif (strpos($file, '.baseline') === FALSE) {
    unset($files[$i]);
  }
}

// Print output.
print "<link rel='stylesheet' type='text/css' href='./style.css'>";
print "<script src='index.js'></script>";
print "<div class='header'>";
print '<h1>Visual Regression Test Results</h1>';
print "</div>";
print "<div id='menu'>";
printFilters($envs);
print "<div id='file_list'>";
printLinks($files_diff, 'Failure Diffs:', 'file_list_diff');
printLinks($files_fail, 'Regressions:', 'file_list_reg');
printLinks($files, 'Baselines:', 'file_list_all');
print "</div>";
print "</div>";
print "<div id='image_diff_wrapper'>";
print "<img id='image_diff'>";
print "</div>";

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
function printLinks($files, $heading, $id = NULL) {
  if (empty($files)) {
    return;
  }

  print "<h4";
  print (!is_null($id) ? " id='title_" . $id : "");
  print "'><span class='title_env'>All</span> " . $heading ."</h4>";
  print (!is_null($id) ? "<table id='" . $id . "'>" : "<table>");
  foreach ($files as $file) {
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

/**
 * Format filters and print.
 */
function printFilters($envs) {
  $filters = array();

  // Only add filter to list if sceenshot exists for it.
  foreach ($envs as $env => $env_count) {
    if ($env_count > 0) {
      $filters[] = "<li><a class='env' id='" . $env . "'>" . ucfirst($env) . "</a></li>";
    }
  }

  // Only display list of filters if more than one filter is available.
  if (count($filters) > 1) {
    print "<div id='env_menu'><ul>";
    print "<li><a class='env active' id='all'>All</a></li>";
    foreach ($filters as $filter) {
      print $filter;
    }
    print "</ul></div>";
  }
}
