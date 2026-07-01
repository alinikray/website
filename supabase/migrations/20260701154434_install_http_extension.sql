/*
# Install http extension for TMDb data import

## Overview
Installs the PostgreSQL `http` extension to allow fetching data from the TMDb API directly within SQL migrations.

## Changes
- Creates the `http` extension in the `extensions` schema
*/

CREATE EXTENSION IF NOT EXISTS http WITH SCHEMA extensions;
