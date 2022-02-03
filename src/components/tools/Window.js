import React from "react";
import cx from "classnames";
import { Rnd } from "react-rnd";
import { SettingsContext } from "../../contexts";
import "./_window.scss";

const handleClasses = {
  bottom: "ns-resize",
  bottomLeft: "nesw-resize",
  bottomRight: "nwse-resize",
  left: "ew-resize",
  right: "ew-resize",
  top: "ns-resize",
  topLeft: "nwse-resize"
};

const resizeStyles = pixels => {
  const corners = pixels * 4;
  return {
    bottom: { height: pixels, bottom: -pixels },
    bottomLeft: { height: corners, width: corners, left: -pixels },
    bottomRight: {
      height: corners,
      width: corners,
      right: -pixels * 2,
      bottom: -pixels * 2
    },
    left: { width: pixels, right: -pixels },
    right: { width: pixels, marginLeft: "100%" },
    top: { height: pixels },
    topLeft: { height: corners, width: corners, left: -pixels, top: -pixels },
    topRight: { width: 0, height: 0 }
  };
};

const randomizeLaunchSpot = max => Math.ceil(Math.random() * max);

const launchPositions = (propX, propY, isMobile) => {
  const random = randomizeLaunchSpot(80);
  const x = propX || random;
  const y = propY || random;
  return !isMobile
    ? {
      x,
      y
    }
    : {
      x: x / 2,
      y: y / 2
    };
};

class Window extends React.PureComponent {
  static contextType = SettingsContext;
  state = {
    height: this.props.initialHeight,
    width: this.props.initialWidth,
    maximized:
      (this.context.isMobile && this.props.resizable) ||
      this.props.maximizeOnOpen,
    // ...launchPositions(this.props.inintalX, this.props.initialY)
  };

  updateLocation = (a, b) => {
    this.setState({ x: b.x, y: b.y, isDragging: false });
  };
  resize = (e, direction, ref, delta, position) =>
    this.setState({
      width: ref.style.width,
      height: ref.style.height,
      ...position
    });
  maximize = () => this.setState({ maximized: true });
  restore = () => this.setState({ maximized: false });
  toggleDrag = val => () => this.setState({ isDragging: val });
  toggleResize = val => () => this.setState({ isResizing: val });

  render() {
    const { context, props } = this;
    const resizeProps =
      this.props.resizable && !this.state.maximized
        ? {
          resizeHandleStyles: resizeStyles(4),
          onResize: this.resize,
          onResizeStart: this.toggleResize(true),
          onResizeStop: this.toggleResize(false)
        }
        : { resizeHandleStyles: resizeStyles(0) };

    const maximizedProps = this.state.maximized
      ? {
        size: { width: "100%" },
        position: { x: -2, y: -3 },
        disableDragging: true
      }
      : undefined;
    return (
      <>
        {this.state.isDragging && (
          <Rnd
            size={{ width: this.state.width, height: this.state.height }}
            position={{ x: this.state.x, y: this.state.y }}
            scale={context.scale}
            style={{
              zIndex: this.props.zIndex,
            }}
          >
            <props.Component
              {...props}
              {...this.state}
              isDragging={false}
              className={cx(props.className, "Window--active")}
            >
              {!props.hideOnDrag && props.children}
            </props.Component>
          </Rnd>
        )}
        <Rnd
          className={
            cx(
              {
                "react-draggable-maximized-hack": this.state.maximized,
                'Window--minimized': this.props.minimized,
              }
            )
          }
          style={{
            zIndex: this.props.zIndex,
            visibility: this.props.minimized ? 'hidden' : undefined,
          }}
          size={
            !this.state.maximized && {
              width: this.state.width,
              height: this.state.height
            }
          }
          position={{ x: this.state.x, y: this.state.y }}
          dragHandleClassName="Window__title"
          resizeHandleClasses={handleClasses}
          onDragStart={this.toggleDrag(true)}
          onDragStop={!this.state.maximized && this.updateLocation}
          bounds=".w98"
          minWidth={this.props.minWidth}
          minHeight={this.props.minHeight}
          maxWidth={!this.state.maximized ? this.props.maxWidth : "105%"}
          maxHeight={!this.state.maximized ? this.props.maxHeight : "105%"}
          scale={context.scale}
          onMouseDown={
            this.props.moveToTop
              ? () => this.props.moveToTop(this.props.id)
              : undefined
          }
          {...resizeProps}
          {...maximizedProps}
        >
          <props.Component
            title={props.title}
            icon={props.icon}
            footer={props.footer}
            onOpen={props.multiInstance && props.onOpen}
            onClose={() => props.onClose(props)}
            // onMinimize={props.onMinimize && (() => props.onMinimize(props.id))}
            onRestore={props.resizable ? this.restore : undefined}
            onMaximize={props.resizable ? this.maximize : undefined}
            changingState={this.state.isDragging || this.state.isResizing}
            maximizeOnOpen={this.context.isMobile || this.props.maximizeOnOpen}
            className={cx(props.className, {
              "Window--active": props.isActive
            })}
            resizable={props.resizable}
            menuOptions={props.menuOptions}
            hasMenu={props.hasMenu}
            explorerOptions={props.explorerOptions}
            data={props.data}
            style={props.style}
            children={props.children}
          />
        </Rnd>
      </>
    );
  }
}

Window.defaultProps = {
  minWidth: 200,
  minHeight: 200,
  initialWidth: '100vw',
  initialHeight: '100vh',
  // maxHeight: 448,
  // maxWidth: 635,
  resizable: false,

  scale: 1,
  title: "Needs default"
};

export default Window;
