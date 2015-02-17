(function () {
  'use strict';
	var app = angular.module('MyApp');

	app.controller('templateCreatorController', function ($scope) {

		// var gui = require('nw.gui');
		// var os = require('os');


		// $scope.description = gui.App.manifest.description;
		// $scope.settings = [];

		// Object.getOwnPropertyNames(os).forEach(function(val, idx, array) {
		// 	if (typeof os[val] === 'function')
		// 	$scope.settings.push({ name: val, value: os[val]() });
		// });

		var fs = require("fs"),
			myEditorTools = myEditorTools || {}
		;

		myEditorTools.newFile = function () {
			myEditorTools.fileEntry = null;
			myEditorTools.hasWriteAccess = false;
			myEditorTools.editor = null;
		};

		myEditorTools.onChosenFileToSaveOrOpen = function (theFileEntry, isSave) {
			myEditorTools.setFile(theFileEntry, isSave);
			if(isSave) {
				myEditorTools.writeEditorToFile(theFileEntry);
			} else {
				myEditorTools.readFileIntoEditor(theFileEntry);
			}
		};

		myEditorTools.setFile = function (theFileEntry, isWritable) {
			myEditorTools.fileEntry = theFileEntry;
			myEditorTools.hasWriteAccess = isWritable;
		};

		myEditorTools.readFileIntoEditor = function (theFileEntry) {
			fs.readFile(theFileEntry, function (err, data) {
				if (err) {
					console.log("Read failed: " + err);
				}


				myEditorTools.editor.setValue(String(data));
			});
		};

		myEditorTools.writeEditorToFile = function (theFileEntry) {

			fs.writeFile(theFileEntry, myEditorTools.editor.getValue(), function (err) {
				if (err) {
					console.log("Write failed: " + err);
					return;
				}

				console.log("Write completed.");
			});
		};

		myEditorTools.handleSaveButton = function () {

			if (myEditorTools.fileEntry && myEditorTools.hasWriteAccess) {
				myEditorTools.writeEditorToFile(fileEntry);
			} else {
				var element = document.querySelector('#save_fileEditor');

				element.addEventListener('change', function(evt) {
					console.log('on Save');
					console.log(this.value);
					myEditorTools.onChosenFileToSaveOrOpen(this.value, true);
				}, false);

				element.click();
			}
		};

		myEditorTools.handleOpenButton = function () {

			var element = document.querySelector('#open_fileEditor');

			element.addEventListener('change', function(evt) {
				console.log('on Open');
				console.log(this.value);
				myEditorTools.onChosenFileToSaveOrOpen(this.value, false);
			}, false);

			element.click();

		};


		$scope.saveFile= function (_editor) {
			myEditorTools.newFile();
			myEditorTools.editor = _editor;
			myEditorTools.handleSaveButton();
		};

		$scope.openFile= function (_editor) {
			myEditorTools.editor = _editor;
			myEditorTools.handleOpenButton();
		};

		$scope.clearEditor= function (_editor) {
			_editor.setValue('');
		};

		/*
			Code Mirror Editors
		 */
		function setCodeMirrorOptions (_editor) {
			_editor.setOption('lineWrapping', true);
			_editor.setOption('lineNumbers', true);
			_editor.setOption('theme', 'monokai');
			_editor.setOption('mode', {name: "javascript", json: true });

			return _editor;
		}

		$scope.codeMirrorLoadedForFileEditor = function (_editor) {
			setCodeMirrorOptions(_editor);
			_editor.getDoc().markClean();
			$scope.fileEditor = _editor;
		};

		$scope.codeMirrorLoadedForMappingEditor = function (_editor) {
			setCodeMirrorOptions(_editor);
			_editor.getDoc().markClean();
			$scope.mappingEditor = _editor;
		};
	});


})();


