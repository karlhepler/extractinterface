// Import filesystem
var fs = require('fs');

// Get the source and destination paths
var source = process.argv[2];
var destination = process.argv[3];
var interfaceName = process.argv[4];

// If there is no source, throw an error
if ( !source ) {
	throw 'You must specify a source path!';
}

// Define the regular expression
var regex = /([\t ]*\/\*[\s\S]*?\*\/)|([\t ]*public.+function.+\(.*\))/img;
var matchFunction = /[\t ]*public.+function.+\(.*\)/i;
var matchComment = /[\t ]*\/\*[\s\S]*?\*\//i;

// Read the source file
var src = fs.readFileSync(source, 'utf8');

// Get the methods & comments from the file
var matches = src.match(regex);

// If there are no matches, throw error
if ( matches === null ) {
	throw 'No matches found!';
}

// Combine the matches
var i = 0;
var combined = [];
while ( i < matches.length ) {
	// If it's a function there is no comment
	// So make the comment blank and go to the next
	if ( matches[i].match(matchFunction) ) {
		combined.push( "\n" + matches[i] );
		i++;
	}

	// It is a comment, which means a function
	// will follow. So grab both and increase by two
	else {
		if ( matches[i+1].match(matchFunction) ) {
			combined.push( "\n" + matches[i] + "\n" + matches[i+1] );
			i+=2;
		}
		else {
			i++;
		}
	}
}

// Create the file text
var text = "<?php\n\ninterface";
if ( interfaceName ) text += (" " + interfaceName);
text += "\n{";
for (var i = 0; i < combined.length; i++) {
	text += combined[i] + ";\n";
}
text += "}";

// Output the interface to the destination
if (destination) {
	fs.writeFileSync(destination, text);
	console.log("Interface written to " + destination);
}