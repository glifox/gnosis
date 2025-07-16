export const text = 
`

- Navigate to the MarkItDown package:

    ~~~sh
    cd packages/markitdown
    ~~~

- Install \`hatch\` in your environment and run tests:

    ~~~sh
    pip install hatch  # Other ways of installing hatch: https://hatch.pypa.io/dev/install/
    hatch shell
    hatch test
    ~~~

    (Alternative) Use the Devcontainer which has all the dependencies installed:

    ~~~sh
    # Reopen the project in Devcontainer and run:
    hatch test
    ~~~

- Run pre-commit checks before submitting a PR: \`pre-commit run --all-files\`

### Contributing 3rd-party Plugins

You can also contribute by creating and sharing 3rd party plugins. See \`packages/markitdown-sample-plugin\` for more details.

## Trademarks

This project may contain trademarks or logos for projects, products, or services. Authorized use of Microsoft
trademarks or logos is subject to and must follow
[Microsoft's Trademark & Brand Guidelines](https://www.microsoft.com/en-us/legal/intellectualproperty/trademarks/usage/general).
Use of Microsoft trademarks or logos in modified versions of this project must not cause confusion or imply Microsoft sponsorship.
Any use of third-party trademarks or logos are subject to those third-party's policies.
`;
