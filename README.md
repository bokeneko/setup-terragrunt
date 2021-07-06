# setup-terragrunt javascript action

This action installs Terragrunt CLI in your GitHub Actions workflow.

## Inputs

The action supports the following inputs:

- `terragrunt_version` - (optional) The version of Terragrunt CLI to install. If no version is given, it will default to latest.

## Outputs

This action does not configure any outputs directly.

## Example usage

```yaml
uses: bokeneko/setup-terragrunt@main
with:
  terragrunt_version: 'latest'
```