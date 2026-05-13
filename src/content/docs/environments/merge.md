# Merging Environments

## When to merge

Merge is for situations where the destination environment needs the same keys as the source but with different values, typically moving from staging to production where production has its own live credentials.

## Staging to production merge workflow

```
agentsecrets environment merge staging production
```

For each key in staging, the CLI prompts you to enter the production value. Press Enter to skip a key and leave its existing production value unchanged.

```bash
Enter production values for each key (press Enter to skip):

STRIPE_KEY (staging: sk_test_***): sk_live_51H...
OPENAI_KEY (staging: sk-proj-***): (skipped)
DATABASE_URL (staging: pos***): postgresql://prod-host/db
```

Only keys that exist in both environments are prompted for. New keys in staging are ignored, and existing keys in production that are not present in staging are preserved.


## Prompting for new values per key

Each prompt shows the key name and a masked preview of the staging value so you know what you are replacing. You type the production value. If you press Enter without typing anything, the key is skipped.


## Merge safety — what does not get overwritten
Skipped keys retain whatever value they currently have in the destination environment, or remain unset if they have never been configured there.

Merge never deletes keys from the destination, it only adds or updates keys you explicitly provide a value for during the prompt.

This makes merge a safe operation when you only want to promote a subset of the source environment.

