# Project agents

Copied from a user-level agent library into the repo so they travel with the project — clone
on any machine and they are available immediately, no local setup.

Each agent is a Markdown file with YAML frontmatter (`name`, `description`). The `name` field is
what Claude Code matches on, so **the filename does not matter but the `name:` line does** — don't
edit it without reason.

## Roster

| Agent | Picked for |
| --- | --- |
| **Frontend Developer** | Building the Astro pages, components and layouts |
| **UX Architect** | The CSS custom-property system and page structure underneath the visuals |
| **UI Designer** | Deciding the actual look — the visual direction is still open |
| **Brand Guardian** | SudoRider's identity: the tech-meets-motorcycle angle, palette, logo, tone |
| **Web GIS Developer** | The Leaflet map, GPX track rendering and video-linked pins |
| **Cartography Designer** | Making that map readable and good-looking, not just functional |
| **DevOps Automator** | The two GitHub Actions workflows — Pages deploy and the RSS video sync |
| **Accessibility Auditor** | WCAG passes; it's a public site |
| **Code Reviewer** | Review passes on the build |
| **SEO Specialist** | Discoverability — the site exists to promote the channel |
| **Video Optimization Specialist** | YouTube-side growth: titles, thumbnails, retention |

## Notes

- Agents start cold with no memory of prior conversation, so they pay off on separable chunks of
  work — the map, a design pass, an accessibility audit — more than on small edits, where
  explaining the task costs more than doing it.
- **Code Reviewer** overlaps with the built-in `/code-review` skill. The skill is the better tool
  for reviewing a diff or a PR; keep the agent for broader "look over this whole area" passes.
- The full library this came from has ~230 agents. Anything else can be copied in the same way:
  drop the `.md` file into this directory and commit it.
