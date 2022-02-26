Project Zomboid Saver
=======================

This is a node-based project to help maintain file-saves easier in Project Zomboid.

Instead of making full backups, you provide a "baseline" save (your best save, essentially) which will have to be backed up at least once - and then any progress from that moment on can save just the deltas (differences in files) each time you trigger it.

Usage
-----
First, as any node project requires, install the dependencies:

- `npm i` or `yarn`

Then, launch the local server with:

- `npm run pz` or `yarn pz`

Go to this URL in a browser tab/window:

`http://localhost:6666`

First setup
-----------

You MUST setup a baseline save folder before this script can detect only the "deltas" while you progress.

Restoring a backup
------------------

So you've got bitten (Nooooooo!)

Not to worry! You can pop open your browser at `http://localhost:6666` to open up the PZ-Saver console.

From there, it can 