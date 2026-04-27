fastlane documentation
----

# Installation

Make sure you have the latest version of the Xcode command line tools installed:

```sh
xcode-select --install
```

For _fastlane_ installation instructions, see [Installing _fastlane_](https://docs.fastlane.tools/#installing-fastlane)

# Available Actions

## iOS

### ios upload_metadata

```sh
[bundle exec] fastlane ios upload_metadata
```

Upload Pluq metadata to App Store Connect

### ios fix_privacy_choices

```sh
[bundle exec] fastlane ios fix_privacy_choices
```

Set privacyChoicesUrl = privacyPolicyUrl on every EDIT AppInfo localization

### ios audit_app_info

```sh
[bundle exec] fastlane ios audit_app_info
```

Audit EDIT AppInfo localizations: print name/subtitle/privacy_* for each locale

### ios fix_privacy_policy_text

```sh
[bundle exec] fastlane ios fix_privacy_policy_text
```

Set privacyPolicyText = privacyPolicyUrl on every EDIT AppInfo localization (Apple TV)

### ios upload_screenshots

```sh
[bundle exec] fastlane ios upload_screenshots
```

Upload Pluq screenshots to App Store Connect

----

This README.md is auto-generated and will be re-generated every time [_fastlane_](https://fastlane.tools) is run.

More information about _fastlane_ can be found on [fastlane.tools](https://fastlane.tools).

The documentation of _fastlane_ can be found on [docs.fastlane.tools](https://docs.fastlane.tools).
