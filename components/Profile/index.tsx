import { useState, useEffect } from "react";
import QRCode from "qrcode.react";
import { Identity } from "../../@types";
import { CopyToClipboard } from "react-copy-to-clipboard";
import EditProfile from "../EditProfile";
import ShowMoreText from "react-show-more-text";
import { nl2br } from "../../lib/utils";
import {
  CheckIcon,
  CopyIcon,
  TwitterLogoIcon,
  GlobeIcon,
} from "@modulz/radix-icons";
import {
  Text,
  Heading,
  Box,
  Flex,
  Tooltip,
  Link as A,
} from "@livepeer/design-system";
interface Props {
  account: string;
  isMyAccount: boolean;
  identity?: Identity;
  css?: object;
}

const Index = ({ account, isMyAccount = false, identity }: Props) => {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (copied) {
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    }
  }, [copied]);

  return (
    <Box css={{ mb: "$3" }}>
      <Box
        css={{
          width: 60,
          height: 60,
          maxWidth: 60,
          maxHeight: 60,
          position: "relative",
          mb: "$2",
          "@bp3": {
            mb: "$3",
            width: 70,
            height: 70,
            maxWidth: 70,
            maxHeight: 70,
          },
        }}
      >
        {identity?.image ? (
          <Box
            as="img"
            css={{
              objectFit: "cover",
              border: "1px solid",
              borderColor: "$hiContrast",
              borderRadius: 1000,
              width: "100%",
              height: "100%",
            }}
            src={
              identity.name.includes(".eth")
                ? `${identity.image}`
                : `https://ipfs.infura.io/ipfs/${identity.image}`
            }
          />
        ) : (
          <Box
            as={QRCode}
            style={{
              border: "1px solid",
              padding: "4px",
              borderRadius: "1000px",
              width: "inherit",
              height: "inherit",
            }}
            fgColor={`#${account.substr(2, 6)}`}
            value={account}
          />
        )}
      </Box>
      <Flex css={{ alignItems: "center", mb: "10px" }}>
        <CopyToClipboard text={account} onCopy={() => setCopied(true)}>
          <Heading
            size="2"
            css={{
              display: "flex",
              alignItems: "center",
              fontWeight: 700,
            }}
          >
            {identity?.name
              ? identity.name
              : account.replace(account.slice(5, 39), "…")}
            <Tooltip
              content={`${copied ? "Copied" : "Copy address to clipboard"}`}
            >
              <Flex
                css={{
                  ml: "$3",
                  mt: "3px",
                  cursor: "pointer",
                  borderRadius: 1000,
                  bc: "$neutral3",
                  border: "1px solid $neutral6",
                  width: 28,
                  height: 28,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {copied ? (
                  <Box
                    as={CheckIcon}
                    css={{
                      width: 14,
                      height: 14,
                      color: "$muted",
                    }}
                  />
                ) : (
                  <Box
                    as={CopyIcon}
                    css={{
                      width: 14,
                      height: 14,
                      color: "$muted",
                    }}
                  />
                )}
              </Flex>
            </Tooltip>
          </Heading>
        </CopyToClipboard>
        {isMyAccount && <EditProfile />}
      </Flex>
      <Flex align="center" css={{ mb: "$4" }}>
        {identity?.website && (
          <Flex align="center" css={{ mr: "$3" }}>
            <Box as={GlobeIcon} css={{ mr: "$1" }} />
            <A
              variant="contrast"
              css={{ fontSize: "$2" }}
              href={identity.website}
              target="__blank"
              rel="noopener noreferrer"
            >
              {identity.website.replace(/(^\w+:|^)\/\//, "")}
            </A>
          </Flex>
        )}

        {identity?.twitter && (
          <Flex align="center">
            <Box as={TwitterLogoIcon} css={{ mr: "$1" }} />
            <A
              variant="contrast"
              css={{ fontSize: "$2" }}
              href={`https://twitter.com/${identity.twitter}`}
              target="__blank"
              rel="noopener noreferrer"
            >
              @{identity.twitter}
            </A>
          </Flex>
        )}
      </Flex>

      {identity?.description && (
        <Text css={{ my: "$3" }}>
          <ShowMoreText
            lines={3}
            more={
              <Box as="span" css={{ color: "$primary11" }}>
                Show more
              </Box>
            }
            less={
              <Box as="span" css={{ color: "$primary11" }}>
                Show Less
              </Box>
            }
          >
            <Box
              css={{ a: { color: "$primary11" } }}
              dangerouslySetInnerHTML={{
                __html: nl2br(identity.description),
              }}
            />
          </ShowMoreText>
        </Text>
      )}
    </Box>
  );
};

export default Index;
